import Badge from "../Bagde/Bagde";
import Container from "../Container/Container";

export default function FeatureDoctor() {
    return (
        <section className="p-16 bg-gray-100">
            <Container>
                <div className="flex flex-col items-center gap-6">
                    <Badge>Feature Doctor</Badge>
                    <h1 className="text-4xl font-bold text-center">Our <span className="text-blue-600">Highlighted</span> Doctor</h1>
                    <div>

                    </div>
                </div>
            </Container>
        </section>
    )
}