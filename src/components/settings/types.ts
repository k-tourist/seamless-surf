export interface ProfileFormData {
  firstName: string;
  lastName: string;
  timezone: string;
}

export interface ProfileFormProps {
  initialData: ProfileFormData;
  isUpdating: boolean;
  onSubmit: (data: ProfileFormData) => void;
}