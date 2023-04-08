import { FormEvent } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const onSubmit = async (formData: any) => {
    console.log(formData.name);

    const postData = async () => {
      const data = {
        name: formData.name,
      };

      try {
        const response = await fetch(
          "http://cambry.sa-east-1.elasticbeanstalk.com/events",
          // "http://localhost:3009/events",
          {
            method: "POST",
            body: JSON.stringify(data),
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.json();
      } catch (error) {
        console.error(error);
      }
    };

    await postData().then((data) => {
      alert(data?.message);
    });
  };

  const { register, handleSubmit } = useForm();

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Item Name:
          <input {...register("name")} type="text" name="name" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </main>
  );
}
