interface Key {
    key_code: string;
    shifted: boolean;
}

interface LayerMap {
    from: Key;
    to: Key;
}

class LayerRule {
    readonly id: string;
    readonly description: string;
    readonly activator: string;
    readonly simultaneous_threshold_milliseconds: number = 800;
    readonly mappings: LayerMap[];

    constructor(id: string, description: string, activator: string, simultaneous_threshold_milliseconds: number, mappings: LayerMap[]) {
        this.id = id;
        this.description = description;
        this.activator = activator;
        this.simultaneous_threshold_milliseconds = simultaneous_threshold_milliseconds;
        this.mappings = mappings;
    }

    makeRule() {
        let manipulators: any[] = [];
        this.mappings.forEach(m => {
            const [p, q] = this.layerManipulator(m);
            manipulators.push(p);
            manipulators.push(q);
        });
        return {
            description: this.description,
            manipulators: manipulators,
        };
    }

    makeManipulators() {
        return this.mappings
            .map(m => this.layerManipulator(m))
            .flat();
    }

    private layerManipulator(map: LayerMap) {
        const mods = (shifted: boolean) => shifted ? ["left_shift"] : {optional: ["any"]};
        const key_map = {
            from: {
                key_code: map.from.key_code,
                modifiers: mods(map.from.shifted),
            },
            to: [
                {
                    key_code: map.to.key_code,
                    modifiers: mods(map.to.shifted),
                },
            ],
            conditions: [
                {
                    type: "variable_if",
                    name: this.id,
                    value: 1,
                },
            ],
            type: "basic",
        };
        const activator = {
            type: "basic",
            from: {
                simultaneous: [
                    {
                        key_code: this.activator,
                    },
                    {
                        key_code: map.from.key_code,
                    },
                ],
                simultaneous_options: {
                    key_down_order: "strict",
                    key_up_order: "strict_inverse",
                    to_after_key_up: [
                        {
                            set_variable: {
                                name: this.id,
                                value: 0,
                            },
                        },
                    ],
                },
                modifiers: {
                    optional: [
                        "any",
                    ],
                },
            },
            to: [
                {
                    set_variable: {
                        name: this.id,
                        value: 1,
                    },
                },
                {
                    key_code: map.to.key_code,
                    modifiers: mods(map.to.shifted),
                },
            ],
            parameters: {
                "basic.simultaneous_threshold_milliseconds": this.simultaneous_threshold_milliseconds,
            },
        };
        return [key_map, activator];
    }
}

function unshift_symbol(char: string): string {
    const shiftMap: Record<string, string> = {
        "!": "1",
        "@": "2",
        "#": "3",
        "$": "4",
        "%": "5",
        "^": "6",
        "&": "7",
        "*": "8",
        "(": "9",
        ")": "0",
        "_": "-",
        "+": "=",
        "{": "[",
        "}": "]",
        "|": "\\",
        ":": ";",
        "\"": "'",
        "<": ",",
        ">": ".",
        "?": "/",
        "~": "`",
    };

    return shiftMap[char] || char;
}

export {
    LayerRule,
    unshift_symbol,
};
export type {LayerMap};