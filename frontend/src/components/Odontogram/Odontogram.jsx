import React from "react";
import Tooth from "../Tooth/Tooth";

const Odontogram = () => {
    const topRowRight = ["18", "17", "16", "15", "14", "13", "12", "11"];
    const topRowLeft = ["21", "22", "23", "24", "25", "26", "27", "28"];
    const bottomRowRight = ["48", "47", "46", "45", "44", "43", "42", "41"];
    const bottomRowLeft = ["31", "32", "33", "34", "35", "36", "37", "38"];

    const topChildRight = ["55", "54", "53", "52", "51"];
    const topChildLeft = ["61", "62", "63", "64", "65"];
    const bottomChildRight = ["85", "84", "83", "82", "81"];
    const bottomChildLeft = ["71", "72", "73", "74", "75"];

    return (
        <div className="p-4 flex flex-col items-center">
            <div className="flex">
                {topRowRight.map((t) => <Tooth key={t} label={t} />)}
                <div className="w-4" />
                {topRowLeft.map((t) => <Tooth key={t} label={t} />)}
            </div>

            <div className="flex mt-4">
                {bottomRowRight.map((t) => <Tooth key={t} label={t} />)}
                <div className="w-4" />
                {bottomRowLeft.map((t) => <Tooth key={t} label={t} />)}
            </div>

            <div className="flex mt-6">
                {topChildRight.map((t) => <Tooth key={t} label={t} />)}
                <div className="w-4" />
                {topChildLeft.map((t) => <Tooth key={t} label={t} />)}
            </div>

            <div className="flex mt-4">
                {bottomChildRight.map((t) => <Tooth key={t} label={t} />)}
                <div className="w-4" />
                {bottomChildLeft.map((t) => <Tooth key={t} label={t} />)}
            </div>
        </div>
    );
};

export default Odontogram;
