import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { setTimeout } from "timers";
import { listTimeZonesCommand } from "../device/commands";
import {
  fetchLatestResults,
  fetchLobbyData,
  sendControliDCommand,
} from "../device/search";

interface TimeZone {
  id: number;
  name: string;
}

interface ITimeZoneResult {
  device: string;
  timezones: TimeZone[];
}

export function TimeZoneSearchInDevice() {
  const [lobbyData, setLobbyData] = useState<Lobby>();
  const [isLoading, setIsLoading] = useState(false);
  const [timezoneResult, setTimezoneResult] = useState<ITimeZoneResult[]>([]);

  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

  useEffect(() => {
    const fetchData = async () => {
      setLobbyData(await fetchLobbyData(session, lobby));
    };

    fetchData();
  }, [session, lobby]);

  async function fetchResults() {
    const devices: Array<ITimeZoneResult> = [];
    const latestResults = await fetchLatestResults(lobbyData);

    if (lobbyData && latestResults && latestResults.length > 0) {
      latestResults.map((result) => {
        try {
          const timezones: { time_zones: TimeZone[] | [] } = JSON.parse(
            result.body.response
          );

          const filteredTimesZones = timezones.time_zones.filter((item) => {
            return item.id !== 1;
          });

          if (filteredTimesZones.length > 0) {
            const device = lobbyData.device.find(
              (device) => device.name === result.deviceId
            );
            if (device)
              devices.push({
                device: device.description,
                timezones: filteredTimesZones,
              });
          }
        } catch (e) {
          console.error("Erro na comunicação com o leitor");
        }
      });
    }

    return devices;
  }

  async function searchTimezones() {
    setIsLoading(true);
    await sendControliDCommand(listTimeZonesCommand, lobbyData);
    await new Promise((resolve) => {
      setTimeout(async () => {
        setTimezoneResult(await fetchResults());
        resolve(true);
      }, 5000);
    });
    setIsLoading(false);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="p-1 text-2xl aspect-square"
          title="Buscar nos dispositivos"
          onClick={searchTimezones}
        >
          <MagnifyingGlass />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Horários cadastrados nos dispositivos</SheetTitle>
          <SheetDescription>
            Saiba quais horários estão vinculados às leitoras faciais.
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <p className="flex flex-1 justify-center items-center mt-12 text-lg text-primary">
            Carregando...
          </p>
        ) : (
          <>
            {timezoneResult && timezoneResult.length > 0
              ? timezoneResult.map((timezone, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 border-primary my-4 p-4 border rounded-lg"
                  >
                    <p className="text-lg text-primary capitalize">
                      {timezone.device}
                    </p>
                    <ul>
                      {timezone.timezones.map((timezone) => (
                        <li key={timezone.id}>
                          {timezone.id} - {timezone.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              : "Nada encontrado"}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
