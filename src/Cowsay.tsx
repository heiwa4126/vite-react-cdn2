import { say } from "cowsay";

export function Cowsay({ text }: { text: string }) {
	return <pre>{say({ text })}</pre>;
}
