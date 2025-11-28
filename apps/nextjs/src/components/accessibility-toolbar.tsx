"use client";

import * as React from "react";
import {
    Settings2,
    Type,
    Sun,
    Eye,
    Minus,
    Plus,
    RotateCcw,
    AlignJustify,
    MousePointer2,
    ZapOff,
    Link,
    BookOpen,
    PersonStanding,
    Speech,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAccessibility, DaltonismType } from "@/context/AccessibilityContext";

export function AccessibilityToolbar() {
    const {
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        daltonism,
        setDaltonism,
        letterSpacing,
        setLetterSpacing,
        cursorSize,
        setCursorSize,
        reduceMotion,
        setReduceMotion,
        highlightLinks,
        setHighlightLinks,
        readingGuide,
        setReadingGuide,
        grayscale,
        setGrayscale,
        dyslexiaFont,
        setDyslexiaFont,
        screenReader,
        setScreenReader,
        resetSettings,
    } = useAccessibility();

    return (
        <div className="fixed bottom-4 right-4 z-50 print:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full shadow-lg bg-background border-2 hover:bg-accent"
                        aria-label="Opciones de Accesibilidad"
                    >
                        <PersonStanding className="h-6 w-6 size-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-[320px] sm:w-[400px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Settings2 className="h-5 w-5" />
                            Accesibilidad
                        </SheetTitle>
                        <SheetDescription>
                            Ajusta la visualización para mejorar tu experiencia.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="grid gap-6 py-6 px-6">
                        {/* Font Size Control */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-base flex items-center gap-2">
                                    <Type className="h-4 w-4" />
                                    Tamaño de Texto
                                </Label>
                                <span className="text-sm text-muted-foreground">
                                    {fontSize}%
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setFontSize(Math.max(75, fontSize - 5))}
                                    disabled={fontSize <= 75}
                                    aria-label="Disminuir texto"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all"
                                        style={{ width: `${((fontSize - 75) / (200 - 75)) * 100}%` }}
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setFontSize(Math.min(200, fontSize + 5))}
                                    disabled={fontSize >= 200}
                                    aria-label="Aumentar texto"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        {/* High Contrast */}
                        <div className="flex items-center justify-between">
                            <Label htmlFor="high-contrast" className="text-base flex items-center gap-2">
                                <Sun className="h-4 w-4" />
                                Alto Contraste
                            </Label>
                            <Switch
                                id="high-contrast"
                                checked={highContrast}
                                onCheckedChange={setHighContrast}
                            />
                        </div>

                        <Separator />

                        {/* Letter Spacing (Dyslexia) */}
                        <div className="flex items-center justify-between">
                            <Label htmlFor="letter-spacing" className="text-base flex items-center gap-2">
                                <AlignJustify className="h-4 w-4" />
                                Espaciado Amplio
                            </Label>
                            <Switch
                                id="letter-spacing"
                                checked={letterSpacing}
                                onCheckedChange={setLetterSpacing}
                            />
                        </div>

                        <Separator />

                        {/* Cursor Size */}
                        <div className="flex items-center justify-between">
                            <Label htmlFor="cursor-size" className="text-base flex items-center gap-2">
                                <MousePointer2 className="h-4 w-4" />
                                Puntero Grande
                            </Label>
                            <Switch
                                id="cursor-size"
                                checked={cursorSize}
                                onCheckedChange={setCursorSize}
                            />
                        </div>

                        <Separator />

                        {/* Reduce Motion */}
                        <div className="flex items-center justify-between">
                            <Label htmlFor="reduce-motion" className="text-base flex items-center gap-2">
                                <ZapOff className="h-4 w-4" />
                                Reducir Movimiento
                            </Label>
                            <Switch
                                id="reduce-motion"
                                checked={reduceMotion}
                                onCheckedChange={setReduceMotion}
                            />
                        </div>

                        <Separator />

                        {/* Highlight Links */}
                        <div className="flex items-center justify-between">
                            <Label htmlFor="highlight-links" className="text-base flex items-center gap-2">
                                <Link className="h-4 w-4" />
                                Resaltar Enlaces
                            </Label>
                            <Switch
                                id="highlight-links"
                                checked={highlightLinks}
                                onCheckedChange={setHighlightLinks}
                            />
                        </div>

                        <Separator />

                        {/* Reading Guide */}
                        {/* Reading Guide */}
                        <div className="flex items-center justify-between">
                            <Label htmlFor="reading-guide" className="text-base flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Guía de Lectura
                            </Label>
                            <Switch
                                id="reading-guide"
                                checked={readingGuide}
                                onCheckedChange={setReadingGuide}
                            />
                        </div>

                        <Separator />

                        {/* Dyslexia Font */}
                        <div className="flex items-center justify-between">
                            <Label htmlFor="dyslexia-font" className="text-base flex items-center gap-2">
                                <Type className="h-4 w-4" />
                                Tipografía Dislexia
                            </Label>
                            <Switch
                                id="dyslexia-font"
                                checked={dyslexiaFont}
                                onCheckedChange={setDyslexiaFont}
                            />
                        </div>

                        <Separator />

                        {/* Screen Reader */}
                        <div className="flex items-center justify-between">
                            <Label htmlFor="screen-reader" className="text-base flex items-center gap-2">
                                <Speech className="h-4 w-4" />
                                Lector de Pantalla
                            </Label>
                            <Switch
                                id="screen-reader"
                                checked={screenReader}
                                onCheckedChange={setScreenReader}
                            />
                        </div>

                        <Separator />

                        {/* Grayscale */}
                        <div className="flex items-center justify-between">
                            <Label htmlFor="grayscale" className="text-base flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Escala de Grises
                            </Label>
                            <Switch
                                id="grayscale"
                                checked={grayscale}
                                onCheckedChange={setGrayscale}
                            />
                        </div>

                        <Separator />

                        {/* Daltonism */}
                        <div className="space-y-3">
                            <Label className="text-base flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Modo Daltonismo
                            </Label>
                            <Select
                                value={daltonism}
                                onValueChange={(value) => setDaltonism(value as DaltonismType)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar modo" />
                                </SelectTrigger>
                                <SelectContent className="!z-[200]">
                                    <SelectItem value="none">Normal</SelectItem>
                                    <SelectItem value="protanopia">Protanopia (Rojo)</SelectItem>
                                    <SelectItem value="deuteranopia">Deuteranopia (Verde)</SelectItem>
                                    <SelectItem value="tritanopia">Tritanopia (Azul)</SelectItem>
                                    <SelectItem value="achromatopsia">Acromatopsia (Grises)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator />

                        {/* Reset Button */}
                        <Button
                            variant="destructive"
                            className="w-full gap-2"
                            onClick={resetSettings}
                        >
                            <RotateCcw className="h-4 w-4" />
                            Restablecer Ajustes
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
