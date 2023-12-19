"use client";
import { OperatorUpdateForm } from "@/components/operator/operatorUpdateForm";
import LoadingIcon from "@/components/loadingIcon";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateOperator() {
  interface Operator {
    operatorId: number;
    username: string;
    name: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    type: "USER" | "ADMIN" | undefined;
    status: "ACTIVE" | "INACTIVE" | undefined;
  }
  interface Values {
    username: string;
    name: string;
    password: string;
    type: "USER" | "ADMIN" | undefined;
    status: "ACTIVE" | "INACTIVE" | undefined;
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [operator, setOperator] = useState<Operator | null>(null);
  const [data, setData] = useState<Values>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("operator/find/" + params.get("id"), {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setOperator(response.data);
      } catch (error) {
        console.error("(operator) Erro ao obter dados:", error);
      }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (operator) {
      setData({
        username: operator.username || "",
        name: operator.name || "",
        password: "",
        type: operator.type || "USER",
        status: operator.status || "ACTIVE",
      });
      console.log("data:");
      console.log(data);
    }
  }, [operator]);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar Operador</h1>
        {data ? <OperatorUpdateForm preloadedValues={data} /> : <LoadingIcon />}
      </section>
    </>
  );
}
