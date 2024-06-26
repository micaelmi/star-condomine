import DeviceTable from "@/components/device/deviceTable";
import { Menu } from "@/components/menu";
import Search from "@/components/search";
import { buttonVariants } from "@/components/ui/button";
import { DeviceMobile, FilePlus } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dispositivos",
};

export default async function Device({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
  };
}) {
  const lobby = searchParams?.lobby || "";
  return (
    <>
      <Menu url={`/dashboard/actions?id=${lobby}`} />
      <section className="max-w-5xl mx-auto mb-24">
        <div className="flex justify-between mb-4">
          <h1 className="text-4xl text-center mb-2">Dispositivos</h1>
          <Search placeholder="Buscar..." pagination={false} />
        </div>
        <div className="max-h-[60vh] overflow-x-auto">
          <DeviceTable lobby={lobby} />
        </div>
        <div className="mt-6 flex gap-4 items-center">
          <Link
            href={`device/new?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FilePlus size={24} /> Registrar dispositivo
            </p>
          </Link>
          <Link
            href="/deviceModel"
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <DeviceMobile size={24} /> Modelos de dispositivo
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
