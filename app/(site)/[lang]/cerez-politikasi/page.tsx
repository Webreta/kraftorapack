import { LegalPage, legalMetadata } from "@/components/site/LegalPage";

type Props = { params: Promise<{ lang: string }> };

export const generateMetadata = ({ params }: Props) => legalMetadata("cerez", params);

export default function Page({ params }: Props) {
  return <LegalPage slug="cerez" params={params} />;
}
