"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button, buttonVariants } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const appearanceFormSchema = z.object({
    theme: z.enum(["light", "dark", "system"], {
        required_error: "Please select a theme.",
    }),
    font: z.enum(["sans", "mono"], {
        invalid_type_error: "Select a font",
        required_error: "Please select a font.",
    }),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

// Load settings from localStorage or use defaults
const loadSavedSettings = (): Partial<AppearanceFormValues> => {
    if (typeof window === 'undefined') return { theme: "system", font: "sans" }

    const savedSettings = localStorage.getItem("appearance-settings")
    return savedSettings ? JSON.parse(savedSettings) : { theme: "system", font: "sans" }
}

export function AppearanceForm() {
    const { setTheme, theme } = useTheme()

    const form = useForm<AppearanceFormValues>({
        resolver: zodResolver(appearanceFormSchema),
        defaultValues: {
            theme: (theme as "light" | "dark" | "system") || "system",
            font: loadSavedSettings().font || "sans"
        },
    })

    // Apply font on initial load and changes
    useEffect(() => {
        const savedSettings = loadSavedSettings()
        if (savedSettings.font) {
            document.documentElement.style.fontFamily =
                savedSettings.font === "mono" ? "var(--font-geist-mono)" : "var(--font-geist-sans)"
        }
    }, [])

    function onSubmit(data: AppearanceFormValues) {
        // Save font preference to localStorage
        localStorage.setItem("appearance-settings", JSON.stringify(data))

        // Apply theme using next-themes
        setTheme(data.theme)

        // Apply font
        document.documentElement.style.fontFamily =
            data.font === "mono" ? "var(--font-geist-mono)" : "var(--font-geist-sans)"

        toast("Appearance settings updated", {
            description: "Your preferences have been saved and applied.",
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="font"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Font</FormLabel>
                            <div className="relative w-max">
                                <FormControl>
                                    <select
                                        className={cn(
                                            buttonVariants({ variant: "outline" }),
                                            "w-[200px] appearance-none font-normal"
                                        )}
                                        {...field}
                                    >
                                        <option value="sans">Geist Sans</option>
                                        <option value="mono">Geist Mono</option>
                                    </select>
                                </FormControl>
                                <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                            </div>
                            <FormDescription>
                                Set the font you want to use in the dashboard.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel>Theme</FormLabel>
                            <FormDescription>
                                Select the theme for the dashboard.
                            </FormDescription>
                            <FormMessage />
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid max-w-md grid-cols-3 gap-8 pt-2"
                            >
                                <FormItem>
                                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                            <RadioGroupItem value="light" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                                            <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                                                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                                                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                            Light
                                        </span>
                                    </FormLabel>
                                </FormItem>
                                <FormItem>
                                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                            <RadioGroupItem value="dark" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                                            <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                                                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                                    <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                            Dark
                                        </span>
                                    </FormLabel>
                                </FormItem>
                                <FormItem>
                                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                            <RadioGroupItem value="system" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                                            <div className="space-y-2 rounded-sm bg-[#ecedef] dark:bg-slate-950 p-2">
                                                <div className="space-y-2 rounded-md bg-white dark:bg-slate-800 p-2 shadow-sm">
                                                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef] dark:bg-slate-400" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef] dark:bg-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                            System
                                        </span>
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormItem>
                    )}
                />

                <Button type="submit">Update preferences</Button>
            </form>
        </Form>
    )
}