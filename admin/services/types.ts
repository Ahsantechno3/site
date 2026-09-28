export interface EntityOption {
  value: string;
  label: string;
}

export interface EntityOptions {
  categoryOptions?: EntityOption[];
  brandOptions?: EntityOption[];
  vendorOptions?: EntityOption[];
  statusOptions?: EntityOption[];
  productOptions?: EntityOption[];
  userOptions?: EntityOption[];
}

