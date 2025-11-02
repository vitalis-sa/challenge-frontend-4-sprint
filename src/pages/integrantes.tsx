import { Footer } from "../components/footer";
import { Header } from "../components/header";
import anaflavia from '../assets/anaflavia.jpeg'
import github from '../assets/github.png'
import linkedin from '../assets/linkedin.png'
import gustavoterada from '../assets/gustavoterada.jpeg'
import joaoguilherme from '../assets/joaoguilherme.jpeg'

export function Integrantes() {
    return (
        <>
            <Header />
            <main className="overflow-x-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 md:p-8 w-full ">
                    {/*w-full h-auto object-cover rounded-t-[15px] transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg*/}
                    <div className="flex flex-col flex-[1_1_300px] bg-white rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition duration-300 ease-in-out overflow-hidden hover:scale-105 hover:shadow-lg">
                        <img className="w-full h-auto object-cover rounded-[15px_15px_0_0]" src={anaflavia} alt="foto da Ana Flávia" />
                        <h3 className="text-purple-800 text-center p-[0.5rem_1rem] font-bold">Ana Flávia</h3>
                        <p className="text-center p-[0.5rem_1rem]">RM561489</p>
                        <p className="text-center p-[0.5rem_1rem]">1TDSPV</p>
                        <a className="items-center self-center mb-[13px]" href="https://www.github.com/afcamelo">
                            <img src={github} alt="Ícone do github" className="w-[32px] h-auto" />
                        </a>
                        <a className="items-center self-center mb-[13px]" href="https://www.linkedin.com/in/anaflaviacamelo/">
                            <img src={linkedin} alt="Ícone do linkedin" className="w-[32px] h-auto" />
                        </a>
                    </div>
                    <div className="flex flex-col flex-[1_1_300px] bg-white rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition duration-300 ease-in-out overflow-hidden hover:scale-105 hover:shadow-lg">
                        <img className="w-full h-auto object-cover rounded-[15px 15px 0 0]" src={gustavoterada} alt="Foto do Gustavo Terada" />
                        <h3 className="text-purple-800 text-center p-[0.5rem_1rem] font-bold">Gustavo Terada</h3>
                        <p className="text-center p-[0.5rem_1rem]">RM562745</p>
                        <p className="text-center p-[0.5rem_1rem]">1TDSPV</p>
                        <a className="items-center self-center mb-[13px]" href="https://www.github.com/gkenji110">
                            <img src={github} alt="Ícone do github" className="w-[32px] h-auto" />
                        </a>
                        <a className="items-center self-center mb-[13px]" href="https://www.linkedin.com/in/gustavo-terada-604661301/">
                            <img src={linkedin} alt="Ícone do linkedin" className="w-[32px] h-auto" />
                        </a>
                    </div>
                    <div className="flex flex-col flex-[1_1_300px] bg-white rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition duration-300 ease-in-out overflow-hidden hover:scale-105 hover:shadow-lg">
                        <img className="w-full h-auto object-cover rounded-[15px 15px 0 0]" src={joaoguilherme} alt="Foto do João Guilherme" />
                        <h3 className="text-purple-800 text-center p-[0.5rem_1rem] font-bold">João Guilherme</h3>
                        <p className="text-center p-[0.5rem_1rem]">RM566234</p>
                        <p className="text-center p-[0.5rem_1rem]">1TDSPV</p>
                        <a className="items-center self-center mb-[13px]" href="https://www.github.com/JoaoGuiNovaes">
                            <img src={github} alt="Ícone do github" className="w-[32px] h-auto" />
                        </a>
                        <a className="items-center self-center mb-[13px]" href="https://www.linkedin.com/in/jo%C3%A3o-guilherme-carvalho-novaes/">
                            <img src={linkedin} alt="Ícone do linkedin" className="w-[32px] h-auto" />
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}