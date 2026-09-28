const genericController = (Model) => {
    return {
        getAll: async (req, res) => {
            try {
                const items = await Model.find();
                res.json(items);
            } catch (error) { res.status(500).json({ message: error.message }); }
        },
        getById: async (req, res) => {
            try {
                const item = await Model.findById(req.params.id);
                if (!item) return res.status(404).json({ message: 'Not found' });
                res.json(item);
            } catch (error) { res.status(500).json({ message: error.message }); }
        },
        create: async (req, res) => {
            try {
                const item = new Model(req.body);
                const saved = await item.save();
                res.status(201).json(saved);
            } catch (error) { res.status(400).json({ message: error.message }); }
        },
        update: async (req, res) => {
            try {
                const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
                if (!updated) return res.status(404).json({ message: 'Not found' });
                res.json(updated);
            } catch (error) { res.status(400).json({ message: error.message }); }
        },
        remove: async (req, res) => {
            try {
                const deleted = await Model.findByIdAndDelete(req.params.id);
                if (!deleted) return res.status(404).json({ message: 'Not found' });
                res.json({ message: 'Deleted successfully' });
            } catch (error) { res.status(500).json({ message: error.message }); }
        }
    };
};

module.exports = genericController;

