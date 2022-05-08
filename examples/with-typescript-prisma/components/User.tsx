import { User } from "@prisma/client";
import * as React from "react";
import EditUser from "./EditUser";

type Props = {
  user: User;
};

const User = ({ user }: Props) => (
  <div>
    {!!user ? (
      <div>
        <h2>Hello {user.name}!</h2>
      </div>
    ) : (
      <div>
        <h2>No user found</h2>
        <p>Use the form below to create one.</p>
        <EditUser user={user} />
      </div>
    )}
  </div>
);

export default User;
