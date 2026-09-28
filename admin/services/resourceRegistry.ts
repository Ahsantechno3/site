import { apiClient } from './api';

export interface ServiceCapabilities {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface ResourceService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: (params: any) => Promise<{ items: any[]; meta: any }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create?: (data: any) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update?: (id: string, data: any) => Promise<any>;
  remove?: (id: string) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadOptions?: () => Promise<any>;
}

export function getCapabilities(service: ResourceService | null): ServiceCapabilities {
  if (!service) return { canCreate: false, canUpdate: false, canDelete: false };
  return {
    canCreate: !!service.create,
    canUpdate: !!service.update,
    canDelete: !!service.remove,
  };
}

export function getResourceService(pathname: string): ResourceService | null {
  const resource = pathname.split('/').filter(Boolean).pop()?.toLowerCase(); // e.g., 'products', 'orders', 'users', 'customers'

  if (!resource) return null;
  
  // Mapping frontend routes to backend API endpoints
  const apiEndpoint = resource === 'customers' ? 'users' : resource;

  return {
    list: async (params) => {
      const { data } = await apiClient.get(`/${apiEndpoint}`, { params });
      if (Array.isArray(data)) {
         return { items: data, meta: { total: data.length, page: 1, limit: data.length } };
      }
      return data;
    },
    create: async (data) => {
      const res = await apiClient.post(`/${apiEndpoint}`, data);
      return res.data;
    },
    update: async (id, data) => {
      const res = await apiClient.put(`/${apiEndpoint}/${id}`, data);
      return res.data;
    },
    remove: async (id) => {
      const res = await apiClient.delete(`/${apiEndpoint}/${id}`);
      return res.data;
    },
    loadOptions: async () => {
      if (apiEndpoint === 'products') {
        const [categoriesResponse, brandsResponse] = await Promise.all([
          apiClient.get('/categories'),
          apiClient.get('/brands'),
        ]);

        return {
          categoryOptions: categoriesResponse.data.map((category: { _id: string; name: string }) => ({
            label: category.name,
            value: category._id,
          })),
          brandOptions: brandsResponse.data.map((brand: { _id: string; name: string }) => ({
            label: brand.name,
            value: brand._id,
          })),
        };
      }
      if (apiEndpoint === 'reviews') {
        const [productsResponse, usersResponse] = await Promise.all([
          apiClient.get('/products'),
          apiClient.get('/users'),
        ]);

        return {
          productOptions: productsResponse.data.map((product: { _id: string; name: string }) => ({
            label: product.name,
            value: product._id,
          })),
          userOptions: usersResponse.data.map((user: {
            _id: string;
            firstName?: string;
            lastName?: string;
            username?: string;
            email: string;
          }) => ({
            label: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || user.email,
            value: user._id,
          })),
        };
      }
      return {};
    }
  };
}

export const mediaService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  upload: async (data: any) => {
    console.log('Uploading media', data);
  }
};

