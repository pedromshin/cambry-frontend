import Image from "next/image";
import { Inter } from "next/font/google";
import { FormEvent } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <main>
      <form onSubmit={(e) => onSubmit(e)}>
        <input placeholder="name" />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
