export interface UserData {
  id: string;
  email: string;
  is_enabled: boolean;
  is_admin: boolean;
}

export interface UserTableProps {
  users: UserData[];
  setUsers: (users: UserData[]) => void;
}

export interface UserRowProps {
  user: UserData;
  onUserUpdate: (updatedUser: UserData) => void;
}