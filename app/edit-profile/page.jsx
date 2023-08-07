"use client";
import { useSession } from "next-auth/react";
import ToggleButton from "@/components/toggleButton";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

/* uploadthing imports */
import "@uploadthing/react/styles.css";
import { UploadButton } from "@uploadthing/react";

const Page = () => {
  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const image = searchParams.get("image");
  const imageKey = searchParams.get("imageKey");
  const bio = searchParams.get("bio");

  const { data: session, status } = useSession();

  const [nameInput, setNameInput] = useState(name);
  const [bioInput, setBioInput] = useState(bio !== "undefined" ? bio : "");
  const [imgInput, setImgInput] = useState(image);
  const [imgKey, setImgKey] = useState(imageKey);

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (session?.user) {
      toast.promise(
        fetch("/api/users/update", {
          method: "PUT",
          body: JSON.stringify({
            name: nameInput,
            bio: bioInput,
            email: session.user.email,
            image: imgInput,
            imageKey: imgKey,
          }),
        }),
        {
          loading: "Saving",
          success: "Successfully Saved Profile",
          error: "Something went wrong",
        }
      );
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen w-screen justify-center overflow-y-scroll sm:items-center">
      <button className=" absolute right-4 top-8 sm:top-4">
        <ToggleButton />
      </button>
      <Link
        href="/"
        className=" absolute left-4 top-8 flex w-fit items-center gap-2 rounded-md bg-slate-400 p-1 text-darkTheme sm:top-4"
      >
        <BiArrowBack /> <p>Home</p>
      </Link>
      <form
        className="m-2 mt-20 flex h-fit w-full flex-col gap-2 overflow-y-scroll rounded-2xl bg-slate-200 p-6 shadow-2xl dark:bg-DarkButNotBlack sm:mt-4 sm:grid sm:w-fit sm:grid-cols-2 sm:gap-4 sm:px-10 "
        onSubmit={handleSubmit}
      >
        <h1 className=" col-start-1 col-end-3 text-center text-xl font-extrabold">
          Edit Profile
        </h1>

        <div className=" col-start-1 flex flex-col items-center justify-center gap-3">
          <Image
            src={imgInput}
            width={100}
            height={100}
            alt="profile"
            className=" aspect-square rounded-full object-cover"
          />
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={async (res) => {
              // Do something with the response
              await fetch("/api/delete-img", {
                method: "PUT",
                body: JSON.stringify(imgKey),
              });
              setImgInput(res[0].fileUrl);
              setImgKey(res[0].fileKey);
              localStorage.setItem("image-key", res[0].fileKey);
              fetch("/api/users/update", {
                method: "PUT",
                body: JSON.stringify({
                  name: nameInput,
                  bio: bioInput,
                  email: session.user.email,
                  image: res[0].fileUrl,
                  imageKey: res[0].fileKey,
                }),
              }),
                toast.success("Successfully Uploaded Image");
            }}
            onUploadError={(error) => {
              toast.error(`File size should be less than 4 MB`);
            }}
          />
          <p className=" -mt-8 bg-slate-200 p-1 text-xs dark:bg-DarkButNotBlack">
            max size: 4 MB
          </p>
        </div>

        <div className=" flex w-full flex-col  justify-center gap-2">
          <label htmlFor="">Name</label>
          <input
            type="text"
            value={nameInput}
            className=" w-full rounded-md bg-slate-300 p-1 px-2 text-sm dark:bg-slate-600"
            onChange={(e) => setNameInput(e.target.value)}
          />
          <label htmlFor="">Email</label>
          <p className="w-full rounded-md bg-slate-300 p-2 text-xs text-slate-500 dark:bg-slate-600 dark:text-slate-400">
            {session?.user.email}
          </p>
          <label htmlFor="">Bio</label>
          <textarea
            name=""
            id=""
            cols="3"
            rows="3"
            value={bioInput}
            className="w-full rounded-md bg-slate-300 p-2 placeholder:text-sm placeholder:text-darkTheme dark:bg-slate-600 dark:placeholder:text-slate-300"
            placeholder="Anything about yourself !!"
            onChange={(e) => setBioInput(e.target.value)}
          ></textarea>
        </div>

        <button
          type="submit"
          className="col-start-1 col-end-3 rounded-md bg-slate-400 p-1 dark:bg-slate-300 dark:text-darkTheme"
        >
          Save
        </button>
      </form>
    </div>
  );
};
export default Page;
