import { Metadata } from "next";

import Studio from ".";

export const metadata: Metadata = {
  title: "Fury | custom design",
  description: "custom design.",
};

export default function StudioPage() {
  return <Studio />;
}
