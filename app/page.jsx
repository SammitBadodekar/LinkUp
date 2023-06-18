import { redirect } from "next/navigation";

export default function Home() {
  const user = null;
  if (!user) {
    redirect("/login");
  }
  return <main className=""></main>;
}
