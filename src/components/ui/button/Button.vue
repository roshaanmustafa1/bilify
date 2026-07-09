<script setup lang="ts">
import type { PrimitiveProps } from"reka-ui"
import type { HTMLAttributes } from"vue"
import type { ButtonVariants } from"."
import { Primitive } from"reka-ui"
import { Icon } from "@iconify/vue"
import { cn } from"@/lib/utils"
import { buttonVariants } from"."

interface Props extends PrimitiveProps {
 variant?: ButtonVariants["variant"]
 size?: ButtonVariants["size"]
 class?: HTMLAttributes["class"]
 loading?: boolean
 disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
 as:"button",
})
</script>

<template>
 <Primitive
 data-slot="button"
 :data-variant="variant"
 :data-size="size"
 :as="as"
 :as-child="asChild"
 :disabled="loading || disabled"
 :class="cn(buttonVariants({ variant, size }), props.class)"
 >
 <Icon v-if="loading" icon="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
 <slot />
 </Primitive>
</template>
