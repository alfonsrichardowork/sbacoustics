"use client";

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DropdownMenuItem } from "@/app/(admin)/admin/components/ui/dropdown-menu";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/user/logout`);
      router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/sign-in`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout}>
      Logout
    </DropdownMenuItem>
  );
};

export default LogoutButton;