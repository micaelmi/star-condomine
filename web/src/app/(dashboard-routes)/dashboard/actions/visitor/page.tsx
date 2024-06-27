import VisitorTable from "@/components/visitor/visitorTable";
import { Menu } from "@/components/menu";
import Search from "@/components/search";
import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FilePlus, FileSearch } from "@phosphor-icons/react/dist/ssr";
import CopyButton from "@/components/copyButton";
import { encrypt } from "@/lib/crypto";

export const metadata: Metadata = {
  title: "Visitantes",
};

export default async function Visitor({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
    c?: string;
  };
}) {
  const lobby = searchParams?.lobby || "";
  const control = searchParams?.c || "";

  const encryptedLobby = encrypt(Number(lobby));

  return (
    <>
      <Menu url={`/dashboard/actions?id=${lobby}`} />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center">Visitantes</h1>
        <div className="flex justify-end mb-4">
          <Search placeholder="Buscar..." pagination={false} />
        </div>
        <div className="max-h-[60vh] overflow-x-auto">
          <VisitorTable lobby={lobby} />
        </div>

        <div className="flex justify-between mr-4">
          {control === "S" && (
            <div className="mt-4 flex items-center gap-2  text-stone-400 font-medium">
              <div className="rounded-full w-4 h-4 bg-red-400"></div> Nomes em
              vermelho: visitantes com acesso sem saída finalizada
            </div>
          )}
          <div className="mt-4 flex items-center gap-2  text-stone-400 font-medium">
            <div className="rounded-full w-6 h-6 bg-amber-500 text-stone-900 text-center">
              ⚠
            </div>
            : cadastro incompleto
          </div>
        </div>
        <div className="mt-4 flex gap-4 items-center">
          <Link
            href={`visitor/new?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FilePlus size={24} /> Registrar Visitante
            </p>
          </Link>
          <Link
            href={`scheduling?lobby=${lobby}&c=${control}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FileSearch size={24} /> Agendamentos
            </p>
          </Link>
          <Link
            href={`access?lobby=${lobby}&c=${control}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FileSearch size={24} /> Acessos
            </p>
          </Link>
          <Link
            href={`visitor/list?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FileSearch size={24} /> Lista detalhada
            </p>
          </Link>
          <CopyButton
            text={`https://starcondomine.starseg.com/guest/visitor?lobby=${encryptedLobby}`}
          />
        </div>
      </section>
    </>
  );
}
