"use client";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import {
  CalendarBlank,
  CalendarCheck,
  Car,
  DeviceMobileCamera,
  HouseLine,
  IdentificationCard,
  MagnifyingGlass,
  Notepad,
  PersonSimpleRun,
  SealWarning,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingIcon from "@/components/loadingIcon";
import { OpenDoorButton } from "@/components/control-id/device/openDoorButton";

interface CalendarProps {
  lobbyCalendarId: number;
  date: string;
  description: string;
}

export default function LobbyDetails() {
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [calendar, setCalendar] = useState<CalendarProps[] | null>(null);

  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobbyId = params.get("id") || "";

  const fetchData = async () => {
    if (session)
      try {
        const path = "lobby/find/" + lobbyId;
        const response = await api.get(path, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        if (response.data) {
          setLobby(response.data);
        }
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  const fetchCalendar = async () => {
    if (session)
      try {
        const path = "lobbyCalendar/today/" + lobbyId;
        const response = await api.get(path, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        if (response.data) {
          setCalendar(response.data);
        }
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  let id = 0;
  let control = "";
  useEffect(() => {
    fetchData();
    fetchCalendar();
  }, [session]);
  if (lobby) {
    id = lobby.lobbyId;
    control = lobby.exitControl === "ACTIVE" ? "S" : "N";
  }
  return (
    <>
      <Menu url={`/dashboard`} />
      {lobby ? (
        <section className="mx-auto mb-24 max-w-5xl">
          <div>
            <div className="flex justify-between items-center">
              <h1 className="mt-2 mb-2 ml-10 text-4xl text-primary">
                Portaria: {lobby ? lobby.name : "Desconhecida"}
              </h1>
              <Link
                href={`actions/details?lobby=${id}`}
                className="flex justify-center items-center gap-2 mr-10 text-xl hover:underline hover:underline-offset-4"
              >
                <MagnifyingGlass />
                Detalhes
              </Link>
            </div>

            {calendar && calendar.length > 0 && (
              <p className="flex items-center gap-2 ml-10 text-xl">
                <Warning size={32} className="text-red-500" /> Verifique as
                restrições do feriado de hoje no calendário
              </p>
            )}
          </div>
          <div className="flex lg:flex-row flex-col flex-wrap justify-center items-center gap-6 mt-8 w-full">
            <Link
              href={`actions/access?lobby=${id}&c=${control}`}
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <PersonSimpleRun />
              Acessos
            </Link>
            <Link
              href={`actions/scheduling?lobby=${id}&c=${control}`}
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <CalendarCheck />
              Agendamentos
            </Link>
            <Link
              href={`actions/visitor?lobby=${id}&c=${control}`}
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <IdentificationCard />
              Visitantes
            </Link>
            {lobby ? (
              lobby.type === "COMPANY" ? (
                <Link
                  href={`actions/employee?lobby=${id}&c=${control}`}
                  className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
                >
                  <HouseLine />
                  Funcionários
                </Link>
              ) : (
                <Link
                  href={`actions/resident?lobby=${id}&c=${control}`}
                  className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
                >
                  <HouseLine />
                  Moradores
                </Link>
              )
            ) : (
              ""
            )}
            <Link
              href={`actions/vehicle?lobby=${id}`}
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <Car />
              Veículos
            </Link>
            <Link
              href={`actions/device?lobby=${id}`}
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <DeviceMobileCamera />
              Dispositivos
            </Link>
            <Link
              href={`actions/problem?lobby=${id}`}
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <SealWarning />
              Problemas
            </Link>
            <Link
              href={`actions/calendar?lobby=${id}`}
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <CalendarBlank />
              Calendário
            </Link>
            <Link
              href={`actions/report?lobby=${id}&c=${control}`}
              className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
            >
              <Notepad />
              Relatórios
            </Link>
            {lobby.ControllerBrand.name === "Control iD" && (
              <div className="flex justify-between px-10 w-full">
                <Link
                  href={`actions/control-id?lobby=${id}`}
                  className="flex justify-center items-center gap-2 border-stone-50 hover:bg-stone-850 p-4 border rounded-md w-[300px] text-3xl transition-colors"
                >
                  Control iD
                </Link>
                <OpenDoorButton />
              </div>
            )}
          </div>
        </section>
      ) : (
        <div className="flex justify-center items-center my-8">
          <LoadingIcon />
        </div>
      )}
    </>
  );
}
