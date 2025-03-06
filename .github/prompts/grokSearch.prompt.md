This is a code snippet for a Grok Search input field for context on waht the UI looks like. Use this as a reference for how to design the extension's UI. Don't use tailwind CSS in the extension though, as it is not supported in the extension environment. Use standard CSS instead.

```html
<div
  class="duration-100 relative w-full max-w-[50rem] ring-1 ring-inset overflow-hidden @container/input focus-within:ring-1 hover:focus-within:ring-input-border-focus pb-12 px-2 @[480px]/input:px-3 rounded-3xl bg-input-incognito focus-within:bg-input-hover-incognito hover:bg-input-hover-incognito ring-input-border-incognito focus-within:ring-input-border-focus-incognito hover:ring-input-border-focus-incognito"
>
  <div class="relative z-10">
    <grammarly-extension
      data-grammarly-shadow-root="true"
      style="position: absolute; top: 0px; left: 0px; pointer-events: none;"
      class="dnXmp"
    ></grammarly-extension
    ><grammarly-extension
      data-grammarly-shadow-root="true"
      style="position: absolute; top: 0px; left: 0px; pointer-events: none;"
      class="dnXmp"
    ></grammarly-extension
    ><span
      class="absolute px-2 @[480px]/input:px-3 py-5 text-secondary pointer-events-none"
      >What do you want to know?</span
    ><textarea
      dir="auto"
      class="w-full px-2 @[480px]/input:px-3 bg-transparent focus:outline-none text-primary align-bottom min-h-14 pt-5 my-0 mb-5"
      style="resize: none; height: 44px !important;"
      spellcheck="false"
    ></textarea>
  </div>
  <div
    class="flex gap-1.5 absolute inset-x-0 bottom-0 border-2 border-transparent p-2 @[480px]/input:p-3 max-w-full"
  >
    <button
      class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-default [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg]:-mx-0.5 h-9 rounded-full py-2 relative px-2 transition-all duration-150 bg-transparent border w-9 aspect-square border-toggle-border text-secondary hover:text-primary hover:bg-toggle-hover"
      type="button"
      tabindex="0"
      data-state="closed"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-[2] "
      >
        <path
          d="M10 9V15C10 16.1046 10.8954 17 12 17V17C13.1046 17 14 16.1046 14 15V7C14 4.79086 12.2091 3 10 3V3C7.79086 3 6 4.79086 6 7V15C6 18.3137 8.68629 21 12 21V21C15.3137 21 18 18.3137 18 15V8"
          stroke="currentColor"
        ></path>
      </svg>
    </button>
    <div
      class=" flex grow gap-1.5 max-w-full"
      style="transform: none; opacity: 1;"
    >
      <div class="grow flex gap-1.5 max-w-full">
        <button
          class="inline-flex gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-default [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg]:-mx-0.5 text-primary h-9 rounded-full px-3.5 py-2 border border-toggle-border overflow-hidden items-center justify-center bg-transparent hover:bg-zinc-400/10 dark:hover:bg-toggle-hover"
          type="button"
          tabindex="0"
          aria-pressed="false"
          data-state="closed"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-[2] text-secondary"
          >
            <path
              d="M19.2987 8.84667C15.3929 1.86808 5.44409 5.76837 7.08971 11.9099C8.01826 15.3753 12.8142 14.8641 13.2764 12.8592C13.6241 11.3504 10.2964 12.3528 10.644 10.844C11.1063 8.839 15.9022 8.32774 16.8307 11.793C18.5527 18.2196 7.86594 22.4049 4.71987 15.2225"
              stroke-width="5"
              stroke-linecap="round"
              class="stroke-black/10 dark:stroke-white/20 transition-all duration-200 origin-center opacity-0 scale-0"
            ></path>
            <path
              d="M2 13.8236C4.5 22.6927 18 21.3284 18 14.0536C18 9.94886 11.9426 9.0936 10.7153 11.1725C9.79198 12.737 14.208 12.6146 13.2847 14.1791C12.0574 16.2581 6 15.4029 6 11.2982C6 3.68585 20.5 2.2251 22 11.0945"
              stroke="currentColor"
              class="transition-transform duration-200 eas-out origin-center rotate-0"
            ></path></svg
          ><span>DeepSearch</span></button
        ><button
          class="gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-default [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg]:-mx-0.5 text-primary h-9 rounded-full px-3.5 py-2 border border-toggle-border overflow-hidden flex items-center justify-center bg-transparent hover:bg-zinc-400/10 dark:hover:bg-toggle-hover"
          type="button"
          tabindex="0"
          aria-pressed="false"
          data-state="closed"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-[2] text-secondary"
          >
            <path
              d="M19 9C19 12.866 15.866 17 12 17C8.13398 17 4.99997 12.866 4.99997 9C4.99997 5.13401 8.13398 3 12 3C15.866 3 19 5.13401 19 9Z"
              class="fill-yellow-100 dark:fill-yellow-400/40 origin-center transition-all duration-100 scale-0 opacity-0"
            ></path>
            <path
              d="M15 16.1378L14.487 15.2794L14 15.5705V16.1378H15ZM8.99997 16.1378H9.99997V15.5705L9.51293 15.2794L8.99997 16.1378ZM18 9C18 11.4496 16.5421 14.0513 14.487 15.2794L15.5129 16.9963C18.1877 15.3979 20 12.1352 20 9H18ZM12 4C13.7598 4 15.2728 4.48657 16.3238 5.33011C17.3509 6.15455 18 7.36618 18 9H20C20 6.76783 19.082 4.97946 17.5757 3.77039C16.0931 2.58044 14.1061 2 12 2V4ZM5.99997 9C5.99997 7.36618 6.64903 6.15455 7.67617 5.33011C8.72714 4.48657 10.2401 4 12 4V2C9.89382 2 7.90681 2.58044 6.42427 3.77039C4.91791 4.97946 3.99997 6.76783 3.99997 9H5.99997ZM9.51293 15.2794C7.4578 14.0513 5.99997 11.4496 5.99997 9H3.99997C3.99997 12.1352 5.81225 15.3979 8.48701 16.9963L9.51293 15.2794ZM9.99997 19.5001V16.1378H7.99997V19.5001H9.99997ZM10.5 20.0001C10.2238 20.0001 9.99997 19.7763 9.99997 19.5001H7.99997C7.99997 20.8808 9.11926 22.0001 10.5 22.0001V20.0001ZM13.5 20.0001H10.5V22.0001H13.5V20.0001ZM14 19.5001C14 19.7763 13.7761 20.0001 13.5 20.0001V22.0001C14.8807 22.0001 16 20.8808 16 19.5001H14ZM14 16.1378V19.5001H16V16.1378H14Z"
              fill="currentColor"
            ></path>
            <path d="M9 16.0001H15" stroke="currentColor"></path>
            <path
              d="M12 16V12"
              stroke="currentColor"
              stroke-linecap="square"
            ></path>
            <g>
              <path
                d="M20 7L19 8"
                stroke="currentColor"
                stroke-linecap="round"
                class="transition-all duration-100 ease-in-out translate-x-0 translate-y-0 opacity-0"
              ></path>
              <path
                d="M20 9L19 8"
                stroke="currentColor"
                stroke-linecap="round"
                class="transition-all duration-100 ease-in-out translate-x-0 translate-y-0 opacity-0"
              ></path>
              <path
                d="M4 7L5 8"
                stroke="currentColor"
                stroke-linecap="round"
                class="transition-all duration-100 ease-in-out translate-x-0 translate-y-0 opacity-0"
              ></path>
              <path
                d="M4 9L5 8"
                stroke="currentColor"
                stroke-linecap="round"
                class="transition-all duration-100 ease-in-out translate-x-0 translate-y-0 opacity-0"
              ></path>
            </g></svg
          ><span>Think</span>
        </button>
      </div>
      <div class="flex items-center">
        <button
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-default [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg]:-mx-0.5 text-primary hover:bg-button-ghost-hover rounded-full px-3.5 py-2 flex-row pl-3 pr-2.5 h-9 sm:px-3 border border-button-outline-border sm:border-0"
          type="button"
          id="radix-:r14:"
          aria-haspopup="menu"
          aria-expanded="false"
          data-state="closed"
        >
          <span class="inline-block text-primary text-xs @[400px]/input:text-sm"
            >Grok 3</span
          ><svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-[2] size-3 sm:size-4 text-secondary transition-transform false"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              stroke-linecap="square"
            ></path>
          </svg>
        </button>
      </div>
    </div>
    <div class="ml-auto flex flex-row items-end gap-1">
      <button
        class="group flex flex-col justify-center rounded-full focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        type="submit"
        disabled=""
        style="opacity: 1;"
      >
        <div
          class="h-9 relative aspect-square flex flex-col items-center justify-center rounded-full ring-inset before:absolute before:inset-0 before:rounded-full before:bg-primary before:ring-0 before:transition-all duration-500 bg-button-secondary text-secondary before:[clip-path:circle(0%_at_50%_50%)] ring-0"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-[2] relative"
          >
            <path
              d="M5 11L12 4M12 4L19 11M12 4V21"
              stroke="currentColor"
            ></path>
          </svg>
        </div>
      </button>
    </div>
  </div>
</div>
```
