export default function SectionTitle ({title}:{title?: string}){

    return (
        <h2 className="text-base font-medium">{title ?? title}</h2>
    )
}