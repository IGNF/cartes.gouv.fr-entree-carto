import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { DefineComponent } from 'vue';
import { ExtractPropTypes } from 'vue';
import { MouseEventToBoolean } from 'focus-trap';
import { Options } from 'focus-trap';
import { PropType } from 'vue';
import { PublicProps } from 'vue';
import { RendererElement } from 'vue';
import { RendererNode } from 'vue';
import { VNode } from 'vue';

export declare const FocusTrap: DefineComponent<ExtractPropTypes<    {
active: {
type: BooleanConstructor;
default: boolean;
};
} & {
escapeDeactivates: {
type: BooleanConstructor;
default: true;
};
returnFocusOnDeactivate: {
type: BooleanConstructor;
default: true;
};
allowOutsideClick: {
type: PropType<Options["allowOutsideClick"]>;
default: true;
};
clickOutsideDeactivates: PropType<Options["clickOutsideDeactivates"]>;
initialFocus: PropType<Options["initialFocus"]>;
fallbackFocus: PropType<Options["fallbackFocus"]>;
checkCanFocusTrap: PropType<Options["checkCanFocusTrap"]>;
checkCanReturnFocus: PropType<Options["checkCanReturnFocus"]>;
delayInitialFocus: {
type: BooleanConstructor;
default: true;
};
document: PropType<Options["document"]>;
preventScroll: BooleanConstructor;
setReturnFocus: PropType<Options["setReturnFocus"]>;
tabbableOptions: PropType<Options["tabbableOptions"]>;
}>, {
activate(): void;
deactivate(): void;
renderImpl(): VNode<RendererNode, RendererElement, {
[key: string]: any;
}> | VNode<RendererNode, RendererElement, {
[key: string]: any;
}>[] | null;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, ("update:active" | "activate" | "postActivate" | "deactivate" | "postDeactivate")[], "update:active" | "activate" | "postActivate" | "deactivate" | "postDeactivate", PublicProps, Readonly<ExtractPropTypes<    {
active: {
type: BooleanConstructor;
default: boolean;
};
} & {
escapeDeactivates: {
type: BooleanConstructor;
default: true;
};
returnFocusOnDeactivate: {
type: BooleanConstructor;
default: true;
};
allowOutsideClick: {
type: PropType<Options["allowOutsideClick"]>;
default: true;
};
clickOutsideDeactivates: PropType<Options["clickOutsideDeactivates"]>;
initialFocus: PropType<Options["initialFocus"]>;
fallbackFocus: PropType<Options["fallbackFocus"]>;
checkCanFocusTrap: PropType<Options["checkCanFocusTrap"]>;
checkCanReturnFocus: PropType<Options["checkCanReturnFocus"]>;
delayInitialFocus: {
type: BooleanConstructor;
default: true;
};
document: PropType<Options["document"]>;
preventScroll: BooleanConstructor;
setReturnFocus: PropType<Options["setReturnFocus"]>;
tabbableOptions: PropType<Options["tabbableOptions"]>;
}>> & Readonly<{
onActivate?: ((...args: any[]) => any) | undefined;
onPostActivate?: ((...args: any[]) => any) | undefined;
onDeactivate?: ((...args: any[]) => any) | undefined;
onPostDeactivate?: ((...args: any[]) => any) | undefined;
"onUpdate:active"?: ((...args: any[]) => any) | undefined;
}>, {
returnFocusOnDeactivate: boolean;
escapeDeactivates: boolean;
allowOutsideClick: boolean | MouseEventToBoolean | undefined;
preventScroll: boolean;
delayInitialFocus: boolean;
active: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, true, {}, any>;

export { }
