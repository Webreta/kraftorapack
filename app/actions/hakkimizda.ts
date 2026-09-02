"use server";

import { revalidatePath } from "next/cache";
import { requireSection } from "@/lib/auth/session";
import { getAboutSettings, saveSetting } from "@/lib/data/settings";
import { readBool, readL } from "@/lib/form";
import { IMAGE_EXTENSIONS, removeUploadedFile, saveUploadedFile } from "@/lib/uploads";
import type { ActionState } from "@/components/admin/Fields";
import type { AboutBlock } from "@/lib/settings/hakkimizda";
import type { CardIconName } from "@/components/site/Icon";

const DIR = "hakkimizda";

function revalidate() {
  revalidatePath("/hakkimizda");
  revalidatePath("/en/hakkimizda");
  revalidatePath("/admin/hakkimizda");
}

async function readBlock(formData: FormData, prefix: string, current: AboutBlock): Promise<AboutBlock | { error: string }> {
  let image = current.image;
  const upload = await saveUploadedFile(formData.get(`${prefix}.image`), DIR, IMAGE_EXTENSIONS);
  if (!upload.ok) return { error: upload.error };
  if (upload.publicPath) {
    await removeUploadedFile(image, DIR);
    image = upload.publicPath;
  } else if (readBool(formData, `${prefix}.imageRemove`)) {
    await removeUploadedFile(image, DIR);
    image = null;
  }
  return {
    eyebrow: readL(formData, `${prefix}.eyebrow`),
    title: readL(formData, `${prefix}.title`),
    text1: readL(formData, `${prefix}.text1`),
    text2: readL(formData, `${prefix}.text2`),
    image,
  };
}

export async function saveAboutIntro(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("hakkimizda");
  const current = await getAboutSettings();
  const title = readL(formData, "title");
  if (!title.tr) return { error: "Türkçe başlık gerekli." };
  await saveSetting("hakkimizda", {
    ...current,
    title,
    subtitle: readL(formData, "subtitle"),
    cta: { title: readL(formData, "ctaTitle"), text: readL(formData, "ctaText") },
  });
  revalidate();
  return { ok: true };
}

export async function saveAboutBlocks(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("hakkimizda");
  const current = await getAboutSettings();
  const story = await readBlock(formData, "story", current.story);
  if ("error" in story) return { error: story.error };
  const mission = await readBlock(formData, "mission", current.mission);
  if ("error" in mission) return { error: mission.error };
  await saveSetting("hakkimizda", { ...current, story, mission });
  revalidate();
  return { ok: true };
}

export async function saveAboutWhy(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("hakkimizda");
  const current = await getAboutSettings();
  const cards = current.why.cards.map((_, i) => ({
    icon: String(formData.get(`cards.${i}.icon`) ?? "check-circle") as CardIconName,
    title: readL(formData, `cards.${i}.title`),
    text: readL(formData, `cards.${i}.text`),
  }));
  await saveSetting("hakkimizda", {
    ...current,
    why: {
      eyebrow: readL(formData, "eyebrow"),
      title: readL(formData, "title"),
      text: readL(formData, "text"),
      cards,
    },
  });
  revalidate();
  return { ok: true };
}
