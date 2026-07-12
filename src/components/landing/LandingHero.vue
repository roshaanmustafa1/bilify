<template>
  <section class="relative w-full pt-32 pb-32 lg:pt-40 lg:pb-48 overflow-hidden bg-[#0a1913] flex flex-col items-center">
    <!-- Aurora Background -->
    <Aurora
      :color-stops="['#0a2e20', '#175239', '#104a34']"
      :blend="0.8"
      :amplitude="1.5"
      :speed="1.2"
      class="opacity-80"
    />
    
    <!-- Overlay Gradients for Depth -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a1913] z-0"></div>
    
    <div class="relative z-10 max-w-6xl mx-auto px-4 flex flex-col items-center text-center w-full">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/90 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <span class="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Introducing Bilify 2.0
      </div>
      
      <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        Unleash And Transform<br />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-100 to-emerald-400 drop-shadow-lg">
          Your Business Potential
        </span>
      </h1>
      
      <p class="text-xl md:text-2xl text-emerald-100/70 max-w-3xl mb-12 font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        Empower your team, streamline workflows, and scale your operations effortlessly with our intuitive cloud-based solution.
      </p>
      
      <div class="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <router-link to="/auth/register" class="bg-primary text-primary-foreground px-10 py-5 rounded-full text-lg font-bold hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_-10px_rgba(16,74,52,0.8)] flex items-center gap-2 border border-emerald-400/30">
          Start for free
          <Icon icon="lucide:arrow-right" class="w-5 h-5" />
        </router-link>
        <a href="#features" class="px-10 py-5 rounded-full text-lg font-bold text-white bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all duration-300 flex items-center gap-2">
          View Features
        </a>
      </div>
      
      <!-- Premium Dashboard Mockup -->
      <div class="mt-24 w-full max-w-5xl relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
        <!-- Glow behind mockup -->
        <div class="absolute inset-0 bg-primary/30 blur-[100px] rounded-full transform -translate-y-12"></div>
        
        <div class="relative bg-[#0f172a] rounded-[2rem] shadow-2xl border border-slate-700/50 overflow-hidden transform perspective-1000 rotate-x-[8deg] translate-y-4 group hover:translate-y-0 hover:rotate-x-0 transition-all duration-1000 ease-out flex">
          
          <!-- Sidebar -->
          <div class="w-64 bg-[#1e293b]/50 border-r border-slate-700/50 p-6 hidden md:block backdrop-blur-xl">
            <div class="flex items-center gap-3 mb-12">
              <div class="w-8 h-8 bg-emerald-500 rounded-lg"></div>
              <div class="h-4 w-20 bg-slate-700 rounded-md"></div>
            </div>
            <div class="space-y-4">
              <div class="h-10 w-full bg-emerald-500/20 rounded-xl flex items-center px-4 gap-3 border border-emerald-500/20">
                <div class="w-5 h-5 rounded bg-emerald-400"></div>
                <div class="h-3 w-16 bg-emerald-400/50 rounded"></div>
              </div>
              <div class="h-10 w-full bg-transparent rounded-xl flex items-center px-4 gap-3">
                <div class="w-5 h-5 rounded bg-slate-600"></div>
                <div class="h-3 w-24 bg-slate-700 rounded"></div>
              </div>
              <div class="h-10 w-full bg-transparent rounded-xl flex items-center px-4 gap-3">
                <div class="w-5 h-5 rounded bg-slate-600"></div>
                <div class="h-3 w-20 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
          
          <!-- Main Content Area -->
          <div class="flex-1 p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
            <!-- Top bar -->
            <div class="flex justify-between items-center mb-10">
              <div class="h-8 w-48 bg-slate-700/50 rounded-lg"></div>
              <div class="flex gap-4">
                <div class="h-10 w-10 bg-slate-700/50 rounded-full"></div>
                <div class="h-10 w-10 bg-emerald-500 rounded-full"></div>
              </div>
            </div>
            
            <!-- Stats Row -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden group-hover:border-emerald-500/30 transition-colors duration-500">
                <div class="w-12 h-12 bg-emerald-500/20 rounded-xl mb-4 flex items-center justify-center border border-emerald-500/20">
                  <div class="w-5 h-5 bg-emerald-400 rounded-sm"></div>
                </div>
                <div class="h-8 w-24 bg-slate-100 rounded-md mb-2"></div>
                <div class="h-4 w-32 bg-slate-600 rounded-md"></div>
                <!-- Decorative gradient -->
                <div class="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full"></div>
              </div>
              
              <div class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <div class="w-12 h-12 bg-primary/20 rounded-xl mb-4 flex items-center justify-center border border-primary/20">
                  <div class="w-5 h-5 bg-primary rounded-sm"></div>
                </div>
                <div class="h-8 w-32 bg-slate-100 rounded-md mb-2"></div>
                <div class="h-4 w-28 bg-slate-600 rounded-md"></div>
              </div>
              
              <div class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                 <div class="w-12 h-12 bg-[#0a2e20]/40 rounded-xl mb-4 flex items-center justify-center border border-[#0a2e20]/40">
                  <div class="w-5 h-5 bg-[#0a2e20] rounded-sm"></div>
                </div>
                <div class="h-8 w-20 bg-slate-100 rounded-md mb-2"></div>
                <div class="h-4 w-24 bg-slate-600 rounded-md"></div>
              </div>
            </div>
            
            <!-- Large Chart Area -->
            <div class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 h-64 flex flex-col justify-between relative overflow-hidden">
              <div class="flex justify-between items-center w-full mb-8">
                <div class="h-5 w-32 bg-slate-600 rounded-md"></div>
                <div class="h-8 w-24 bg-slate-700/50 rounded-lg"></div>
              </div>
              <!-- Fake Chart Bars -->
              <div class="flex items-end gap-4 h-full pt-4">
                <div class="w-full bg-emerald-500/80 rounded-t-lg h-[40%] group-hover:h-[60%] transition-all duration-1000 delay-100"></div>
                <div class="w-full bg-slate-600/50 rounded-t-lg h-[60%] group-hover:h-[40%] transition-all duration-1000 delay-200"></div>
                <div class="w-full bg-emerald-500/80 rounded-t-lg h-[30%] group-hover:h-[70%] transition-all duration-1000 delay-300"></div>
                <div class="w-full bg-slate-600/50 rounded-t-lg h-[80%] group-hover:h-[50%] transition-all duration-1000 delay-100"></div>
                <div class="w-full bg-emerald-500 rounded-t-lg h-[50%] group-hover:h-[90%] transition-all duration-1000 delay-200 relative">
                  <!-- Tooltip -->
                  <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-700 shadow-lg">$12,450</div>
                </div>
                <div class="w-full bg-slate-600/50 rounded-t-lg h-[70%] group-hover:h-[30%] transition-all duration-1000 delay-300"></div>
              </div>
            </div>
          </div>
          
          <!-- Floating Elements (Parallax effect) -->
          <div class="absolute -right-8 top-1/4 bg-white p-4 rounded-2xl shadow-2xl border border-slate-200 w-48 hidden lg:block transform translate-x-4 group-hover:-translate-x-4 transition-transform duration-1000 ease-out">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Icon icon="lucide:check" class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div class="h-3 w-16 bg-slate-800 rounded mb-1"></div>
                <div class="h-2 w-12 bg-slate-400 rounded"></div>
              </div>
            </div>
          </div>
          
          <div class="absolute -left-12 bottom-1/4 bg-slate-900 p-5 rounded-2xl shadow-2xl border border-slate-700 w-56 hidden lg:block transform -translate-x-4 group-hover:translate-x-4 transition-transform duration-1000 ease-out z-20">
            <div class="h-3 w-20 bg-slate-500 rounded mb-4"></div>
            <div class="text-2xl font-bold text-white mb-1">+48.5%</div>
            <div class="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 w-[75%]"></div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Icon } from '@iconify/vue';
import Aurora from '../Aurora.vue';

export default defineComponent({
  name: 'LandingHero',
  components: {
    Icon,
    Aurora
  }
});
</script>
