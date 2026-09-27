import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  Info,
  Music,
  FileText,
  Box,
  AlertCircle,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import Button from "@/c2/ui/Button"; 
export interface MediaItem {
  id?: number | string;
  _id?: string;
  /** The raw picked file — present only for not-yet-uploaded items. */
  file?: File;
  title: string;
  altText: string;
  caption: string;
  description: string;
  dimensions: string;
  size: string;
  type: string;
  ext: string;
  date: string;
  previewUrl: string;
  mediaCategory: "image" | "video" | "audio" | "model3d" | "document";
}

interface MediaHandlerModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialData?: any | null;
  onClose: () => void;
  onSave: (mediaData: any) => void;
  onDelete?: (mediaId: any) => void;
}

const MediaHandlerModal: React.FC<MediaHandlerModalProps> = ({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave,
  onDelete,
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setMediaList([
          {
            id: initialData._id || initialData.id || Date.now(),
            title: initialData.title || initialData.name || "",
            altText: initialData.altText || "",
            caption: initialData.caption || "",
            description: initialData.description || "",
            dimensions: initialData.dimensions || "N/A",
            size: initialData.size || "0 MB",
            type: initialData.type || "application/octet-stream",
            ext: initialData.ext || "",
            date: initialData.date || new Date().toISOString().split("T")[0],
            previewUrl: initialData.previewUrl || initialData.url || "",
            mediaCategory: initialData.mediaCategory || "image",
          },
        ]);
        setSelectedIndex(0);
      } else {
        setMediaList([]);
        setSelectedIndex(0);
      }
      setErrorMessage("");
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const currentItem = mediaList[selectedIndex];

  const ALLOWED_EXTENSIONS = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
    "csv",
    "glb",
    "gltf",
  ];

  const validateAndGetCategory = (
    file: File,
  ): MediaItem["mediaCategory"] | null => {
    const fileType = file.type.toLowerCase();
    const extension = file.name.split(".").pop()?.toLowerCase() || "";

    if (fileType.startsWith("image/")) return "image";
    if (fileType.startsWith("video/")) return "video";
    if (fileType.startsWith("audio/")) return "audio";
    if (ALLOWED_EXTENSIONS.includes(extension)) {
      return extension === "glb" || extension === "gltf"
        ? "model3d"
        : "document";
    }
    return null;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    setErrorMessage("");
    const validItems: MediaItem[] = [];
    let hasInvalidFiles = false;

    files.forEach((file, i) => {
      const category = validateAndGetCategory(file);

      if (!category) {
        hasInvalidFiles = true;
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      const newItem: MediaItem = {
        id: Date.now() + i,
        file,
        title: file.name,
        altText: file.name.split(".")[0].replace(/[-_]/g, " "),
        caption: "",
        description: "",
        dimensions:
          category === "image" || category === "video" ? "Detecting..." : "N/A",
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type || `application/${file.name.split(".").pop()}`,
        ext: `.${file.name.split(".").pop()}`,
        date: new Date().toISOString().split("T")[0],
        previewUrl: previewUrl,
        mediaCategory: category,
      };

      if (category === "image") {
        const img = new Image();
        img.src = previewUrl;
        img.onload = () => {
          setMediaList((prev) =>
            prev.map((item) =>
              item.id === newItem.id
                ? {
                    ...item,
                    dimensions: `${img.naturalWidth} x ${img.naturalHeight} px`,
                  }
                : item,
            ),
          );
        };
      }

      validItems.push(newItem);
    });

    if (hasInvalidFiles) {
      setErrorMessage(
        "Kuch unsupported files reject ho gain. Sirf Images, Videos, Audios aur Documents allowed hain.",
      );
    }

    if (validItems.length > 0) {
      setMediaList((prev) => {
        const updated = [...prev, ...validItems];
        if (prev.length === 0) {
          setSelectedIndex(0);
        }
        return updated;
      });
    }
  };

  const handleInputChange = (field: keyof MediaItem, value: string) => {
    if (selectedIndex === undefined || !mediaList[selectedIndex]) return;
    setMediaList((prev) => {
      const updated = [...prev];
      updated[selectedIndex] = { ...updated[selectedIndex], [field]: value };
      return updated;
    });
  };

  const handleSaveClick = () => {
    if (!currentItem) return;
    onSave(currentItem);
  };

  const handleDeleteClick = () => {
    if (!currentItem) return;
    if (onDelete) {
      onDelete(currentItem.id || currentItem._id);
    }
    const updatedList = mediaList.filter((_, idx) => idx !== selectedIndex);
    setMediaList(updatedList);
    setSelectedIndex(Math.max(0, selectedIndex - 1));
  };

  const renderThumbnail = (item: MediaItem) => {
    switch (item.mediaCategory) {
      case "image":
        return (
          <img
            src={item.previewUrl}
            alt={item.altText}
            className="w-full h-full object-cover"
          />
        );
      case "video":
        return (
          <video src={item.previewUrl} className="w-full h-full object-cover" />
        );
      case "audio":
        return <Music className="w-8 h-8 text-[var(--primary)]" />;
      case "model3d":
        return <Box className="w-8 h-8 text-[var(--text-soft)]" />;
      default:
        return <FileText className="w-8 h-8 text-[var(--text-muted)]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3">
      <div className="w-full max-w-5xl rounded-xl overflow-hidden flex flex-col h-[95vh] sm:max-h-[90vh] shadow-[0_0_20px_rgba(249,115,22,0.15)] bg-[var(--surface)] text-[var(--text)] border border-[var(--primary)]">
        {/* Header */}
        <div className="flex items-center justify-between p-3 shrink-0 border-b border-[var(--border)]">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[var(--text)]">
              {mode === "edit" ? "Edit Media Details" : "Media Upload Panel"}
            </h2>
            <p className="text-[11px] sm:text-xs text-[var(--text-muted)]">
              Strictly accepts Images, Videos, Audios, and Documents only.
            </p>
          </div>
          <Button variant="ghost" size="md" className="border-none" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden p-3 gap-3">
          {/* Left Panel */}
          <div className="w-full md:w-1/2 flex flex-col gap-3 overflow-y-auto shrink-0 md:shrink overflow-hidden">
            {errorMessage && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-md text-xs">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <label className="border-2 h-55 border-dashed rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]">
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-[var(--primary)]" />
              <p className="text-xs sm:text-sm font-medium text-center text-[var(--text)]">
                DRAG & DROP MEDIA FILES HERE
              </p>
              <p className="text-[11px] sm:text-xs mt-1 text-center text-[var(--text-muted)]">
                Accepted: Images, Videos, Audio & Documents
              </p>
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.glb,.gltf"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            {/* Gallery Grid / Empty State */}
            <div className="border border-dashed rounded-xl border-[var(--border)] bg-[var(--background)] h-full max-h-35 md:max-h-full overflow-hidden p-3 pr-1">
              {mediaList.length > 0 ? (
                <div className="overflow-y-auto overflow-x-hidden pr-1 max-h-full grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-3 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--primary)] [&::-webkit-scrollbar-thumb]:rounded-[4px] [&::-webkit-scrollbar-button]:hidden">
                  {mediaList.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all flex items-center justify-center bg-[var(--background)] ${
                        selectedIndex === index
                          ? "border-[var(--primary)]"
                          : "border-[var(--border)] border-2"
                      }`}
                    >
                      <div className="w-full h-full flex items-center justify-center overflow-hidden">
                        {renderThumbnail(item)}
                      </div>
                      <div className="absolute bottom-0 inset-x-0 px-1.5 py-0.5 text-[9px] truncate bg-black/80 text-[var(--text-soft)] text-center">
                        {item.title}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col mr-2 items-center justify-center text-center border border-dashed rounded-xl border-[var(--border)] bg-[var(--background)]">
                  <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 opacity-40 text-[var(--text-muted)]" />
                  <p className="text-xs sm:text-sm font-medium text-[var(--text)]">
                    No media yet
                  </p>
                  <p className="text-[11px] sm:text-xs mt-1 text-[var(--text-muted)]">
                    Upload media to see details and manage attributes.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 p-3 flex flex-col gap-3 overflow-y-auto bg-[var(--background)] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--primary)] [&::-webkit-scrollbar-thumb]:rounded-[4px] [&::-webkit-scrollbar-button]:hidden border rounded-xl border-[var(--border)]">
            {currentItem ? (
              <>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 text-[var(--text-muted)]">
                    MEDIA DETAILS
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs mb-1 text-[var(--text-soft)]">
                        Title / Name
                      </label>
                      <input
                        type="text"
                        value={currentItem.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className="w-full rounded-md px-3 py-1.5 text-xs focus:outline-none bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] focus:border-[var(--primary)]"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1 text-xs mb-1 text-[var(--text-soft)]">
                        Alt Text (SEO){" "}
                        <Info size={12} className="text-[var(--text-muted)]" />
                      </label>
                      <input
                        type="text"
                        value={currentItem.altText}
                        onChange={(e) =>
                          handleInputChange("altText", e.target.value)
                        }
                        className="w-full rounded-md px-3 py-1.5 text-xs focus:outline-none bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] focus:border-[var(--primary)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs mb-1 text-[var(--text-soft)]">
                        Caption
                      </label>
                      <textarea
                        rows={2}
                        value={currentItem.caption}
                        onChange={(e) =>
                          handleInputChange("caption", e.target.value)
                        }
                        className="w-full rounded-md px-3 py-1.5 text-xs focus:outline-none resize-none bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] focus:border-[var(--primary)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs mb-1 text-[var(--text-soft)]">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={currentItem.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        className="w-full rounded-md px-3 py-1.5 text-xs focus:outline-none resize-none bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] focus:border-[var(--primary)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)]">
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 text-[var(--text-muted)]">
                    System Auto-Generated Info (Read-only)
                  </h3>
                  <div className="space-y-2 text-xs text-[var(--text-soft)]">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Category</span>
                      <span className="font-mono capitalize">
                        {currentItem.mediaCategory}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">
                        Dimensions
                      </span>
                      <span className="font-mono">
                        {currentItem.dimensions}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">
                        File Size
                      </span>
                      <span className="font-mono">{currentItem.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">
                        MIME Type
                      </span>
                      <span className="font-mono">{currentItem.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">
                        Upload Date
                      </span>
                      <span className="font-mono">{currentItem.date}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 min-h-[150px]">
                <Info className="w-10 h-10 mb-2 opacity-30 text-[var(--text-muted)]" />
                <p className="text-xs font-medium text-[var(--text-soft)]">
                  No details available
                </p>
                <p className="text-[11px] mt-1 text-[var(--text-muted)]">
                  Upload media files to view and edit details here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 shrink-0 bg-[var(--surface)] border-t border-[var(--border)]">
          <div>
            <Button
              variant="danger"
              size="md"
              icon={Trash2}
              onClick={handleDeleteClick}
              disabled={!currentItem}
            >
              Remove Media
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={`${currentItem? "primary":"ghost"}`}
              size="md"
              onClick={handleSaveClick}
              disabled={!currentItem}
            >
              Save Media Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaHandlerModal;
