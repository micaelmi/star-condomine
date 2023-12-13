"use client";
import { ResidentUpdateForm } from "@/components/member/residentUpdateForm";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateResident() {
  interface Member {
    memberId: number;
    type: string;
    profileUrl: string;
    name: string;
    rg: string;
    cpf: string;
    email: string;
    comments: string;
    status: string;
    faceAccess: string;
    biometricAccess: string;
    remoteControlAccess: string;
    passwordAccess: string;
    addressTypeId: number;
    addressType: {
      addressTypeId: number;
      description: string;
    };
    address: string;
    accessPeriod: Date;
    telephone: {
      telephoneId: number;
      number: string;
    }[];
    position: string;
    createdAt: string;
    updatedAt: string;
    lobbyId: number;
  }
  interface Values {
    profileUrl: File;
    name: string;
    cpf: string;
    rg: string;
    email: string;
    addressType: number;
    address: string;
    comments: string;
    faceAccess: boolean;
    biometricAccess: boolean;
    remoteControlAccess: boolean;
    telephone: string;
  }
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [member, setMember] = useState<Member | null>(null);
  const [data, setData] = useState<Values>();

  function bool(value: string | undefined) {
    return value === "true";
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("member/find/" + params.get("id"), {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setMember(response.data);
      } catch (error) {
        console.error("(Member) Erro ao obter dados:", error);
      }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (member) {
      setData({
        profileUrl: new File([], ""),
        name: member?.name || "",
        cpf: member?.cpf || "",
        rg: member?.rg || "",
        email: member?.email || "",
        addressType: member?.addressTypeId || 0,
        address: member?.address || "",
        faceAccess: bool(member?.faceAccess) || false,
        biometricAccess: bool(member?.biometricAccess) || false,
        remoteControlAccess: bool(member?.remoteControlAccess) || false,
        comments: member?.comments || "",
        telephone: "",
      });
      console.log("data:");
      console.log(data);
    }
  }, [member]);

  return (
    <section className="flex flex-col justify-center items-center mb-12">
      <h1 className="text-4xl mt-2 mb-4">Atualizar Morador</h1>
      {data ? (
        <ResidentUpdateForm preloadedValues={data} />
      ) : (
        <p>Carregando...</p>
      )}
    </section>
  );
}
