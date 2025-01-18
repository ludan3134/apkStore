import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import i18n from "../i18n/i18n";
import TranslateIcon from "@mui/icons-material/Translate";
import IconButton from "@mui/material/IconButton";

const lngs = {
    en: {nativeName: "English"},
    zh: {nativeName: "中文"},
    pt: {nativeName: "Português"}, // 添加葡萄牙语的选项
};

export function ChangeLanguage() {
    const storedLanguage = localStorage.getItem("selectedLanguage") || "pt"; // 获取上次存储的语言

    // useEffect(() => {
    //     // 设置组件挂载时的默认语言
    //     i18n.changeLanguage(storedLanguage);
    // }, [storedLanguage]); // 依赖项数组包含storedLanguage，以便在它变化时重新运行effect
    const handleLanguageChange = (evt) => {
        i18n.changeLanguage(evt.target.value);
    };
    return (
        <IconButton size="large">
            <TranslateIcon fontSize="inherit"/>
            <select defaultValue={storedLanguage} onChange={handleLanguageChange}>
                {Object.keys(lngs).map((lng) => (
                    <option
                        key={lng}
                        value={lng}
                        label={lngs[lng].nativeName}
                        style={{
                            fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal",
                        }}
                    />
                ))}
            </select>
        </IconButton>
    );
}

export default ChangeLanguage;
