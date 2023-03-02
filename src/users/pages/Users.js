import React from "react";
import UserList from "../components/UserList";

export default function Users() {
  const USERS = [
    {
      id: "1234",
      name: "Robert Smith",
      image:
        "https://www.cdc.gov/cancer/prostate/images/man-1200x630.jpg?_=21491",
      place: 3,
    },
  ];
  return <UserList items={USERS} />;
}
