/* QA-only framebuffer capture from the independently downloaded native engine. */
#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
void SDL_GL_SwapWindow(void *window) {
    static void (*swap)(void *);
    if (!swap) swap=dlsym(RTLD_NEXT,"SDL_GL_SwapWindow");
    const char *request=getenv("KENJATIME_QA_CAPTURE_REQUEST");
    const char *output=getenv("KENJATIME_QA_CAPTURE_OUTPUT");
    if (request && output && access(request,F_OK)==0) {
        void (*size)(void *,int *,int *)=dlsym(RTLD_NEXT,"SDL_GL_GetDrawableSize");
        void *(*proc)(const char *)=dlsym(RTLD_NEXT,"SDL_GL_GetProcAddress");
        void (*read)(int,int,int,int,unsigned,unsigned,void *)=proc("glReadPixels");
        int w=0,h=0;size(window,&w,&h);
        if (w>0 && h>0 && w<=4096 && h<=4096) {
            unsigned char *pixels=malloc((size_t)w*h*4);
            if (pixels) {
                read(0,0,w,h,0x1908,0x1401,pixels);
                FILE *f=fopen(output,"wb");
                if (f) {
                    fprintf(f,"P6\n%d %d\n255\n",w,h);
                    for(int y=h-1;y>=0;y--) for(int x=0;x<w;x++) fwrite(pixels+((size_t)y*w+x)*4,1,3,f);
                    fclose(f);unlink(request);
                }
                free(pixels);
            }
        }
    }
    swap(window);
}
