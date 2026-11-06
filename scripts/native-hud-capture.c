/* QA-only Linux swap hook; never included in the Android app. */
#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
void SDL_GL_SwapWindow(void *window) {
    static void (*swap)(void*);static int frame;
    if(!swap)swap=dlsym(RTLD_NEXT,"SDL_GL_SwapWindow");frame++;
    if(frame==440){
        void (*size)(void*,int*,int*)=dlsym(RTLD_NEXT,"SDL_GL_GetDrawableSize");
        void *(*proc)(const char*)=dlsym(RTLD_NEXT,"SDL_GL_GetProcAddress");
        void (*read)(int,int,int,int,unsigned,unsigned,void*)=proc("glReadPixels");
        int w,h;size(window,&w,&h);unsigned char *data=malloc((size_t)w*h*4);read(0,0,w,h,0x1908,0x1401,data);
        const char *path=getenv("KENJATIME_HUD_CAPTURE");if(path){FILE *file=fopen(path,"wb");if(file){fprintf(file,"P6\n%d %d\n255\n",w,h);for(int y=h-1;y>=0;y--)for(int x=0;x<w;x++)fwrite(data+((size_t)y*w+x)*4,1,3,file);fclose(file);}}free(data);
    }
    swap(window);if(frame==460)exit(0);
}
