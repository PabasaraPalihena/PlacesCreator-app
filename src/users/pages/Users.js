import React from "react";
import UserList from "../components/UserList";

export default function Users() {
  const USERS = [
    {
      id: "1234",
      name: "Robert Smith",
      image:
        "https://media.istockphoto.com/id/1200677760/photo/portrait-of-handsome-smiling-young-man-with-crossed-arms.jpg?s=612x612&w=0&k=20&c=g_ZmKDpK9VEEzWw4vJ6O577ENGLTOcrvYeiLxi8mVuo=",
      place: 3,
    },
  ];
  return <UserList items={USERS} />;
}
