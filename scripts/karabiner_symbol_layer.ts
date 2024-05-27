import {type LayerMap, LayerRule, unshift_symbol} from "./karabiner_gen.ts";

function makeLayer(layer: LayerRule) {
    return JSON.stringify(layer.makeManipulators(), null, 2);
}


const mappings: Array<[string, string]> = [
    ["q", "@"],
    ["w", "#"],
];
const layout = mappings.map(([k, v]: [string, string]) => map_symbol(k, v));

const symbol_layer = new LayerRule(
    "symbol_layer",
    "activate symbol layer when j is pressed",
    "j",
    800,
    layout,
);

function map_symbol(from: string, to: string): LayerMap {
    return {
        from: {
            key_code: from,
            shifted: false,
        },
        to: {
            key_code: unshift_symbol(to),
            shifted: true,
        },
    };
}

console.log(makeLayer(symbol_layer));
