import mafruza from "/public/team/mafruza.png";
import ayubxon from "/public/team/ayubxon.jpg";
import abduaziz from "/public/team/abduaziz.png";
import { FaGithub, FaLinkedin, FaTelegramPlane } from "react-icons/fa";
import React from "react";
const teamMembers = [
    {
        name: "Ayubxon Obidov",
        role: "Backend developer",
        img: ayubxon,
        telegram: "https://t.me/ayubxonobidov",
        github: "https://github.com/ayubxon0880",
        linkedin: "https://www.linkedin.com/in/ayubxon-obidov/",
    },
    {
        name: "Mafruza Artiqbaeva",
        role: "Frontend Developer",
        img: mafruza,
        telegram: "https://t.me/aartiqbaeva",
        github: "https://github.com/artiqbaeva",
        linkedin: "https://www.linkedin.com/in/mafruza-artiqbaeva/",
    },
    {
        name: "Abduaziz Komilov",
        role: "Frontend Developer",
        img: abduaziz,
        telegram: "https://t.me/likecaeser",
        github: "https://github.com/wifv",
        linkedin: "https://www.linkedin.com/in/abduaziz-komilov-573797327/",
    }
];

const TeamPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fdf8f6] to-[#fcefe9] py-12 px-6">
            <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                    Bizning Jamoa
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto mb-12">
                    Ushbu platforma fidoyi va professional dasturchilar tomonidan ishlab
                    chiqilgan. Har bir jamoa a’zosi o‘z bilim va tajribasi bilan hissasini
                    qo‘shgan.
                </p>

                {/* Jamoa kartalari */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all"
                        >
                            <img
                                src={member.img}
                                alt={member.name}
                                className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
                            />
                            <h2 className="text-xl font-semibold text-gray-800">
                                {member.name}
                            </h2>
                            <p className="text-gray-500 text-sm mb-4">{member.role}</p>
                            <div className="flex justify-center gap-4 text-gray-500">
                                <a
                                    href={member.telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-400"
                                >
                                    <FaTelegramPlane size={20} />
                                </a>
                                <a
                                    href={member.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-800"
                                >
                                    <FaGithub size={20} />
                                </a>
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-600"
                                >
                                    <FaLinkedin size={20} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(TeamPage);
