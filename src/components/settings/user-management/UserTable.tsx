import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { UserTableProps } from "./types";
import { UserTableRow } from "./UserTableRow";

export const UserTable = ({ users, setUsers }: UserTableProps) => {
  const handleUserUpdate = (updatedUser: UserTableProps["users"][0]) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Access</TableHead>
          <TableHead>Admin Rights</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <UserTableRow 
            key={user.id} 
            user={user} 
            onUserUpdate={handleUserUpdate}
          />
        ))}
      </TableBody>
    </Table>
  );
};