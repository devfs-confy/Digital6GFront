<template>
    <div class="flex flex-col justify-center items-center w-screen h-screen overflow-hidden bg-[#0D291C]">


        <div class="
      flex flex-col items-center justify-center
       p-6 gap-6


      lg:flex-row lg:w-[50%] lg:h-[75%] lg:gap-[7vw] lg:p-12 
      md:flex-row md:w-[85%] md:h-[75%] md:gap-[7vw] md:p-12

      max-md:flex-row max-md:w-[60%] max-md:h-[95%] max-md:gap-[7vw] max-md:p-5
      max-md:flex-row max-sm:w-[75%]  max-sm:gap-[7vw] max-sm:p-5
      bg-white overflow-hidden rounded-2xl shadow-[2px_2px_18px_#299261]
      relative
    ">
            <img class="absolute top-0 right-0 lg:w-[25%] max-md:w-[40%] max-sm:w-[30%] "
                src="../assets/img/confy-verde.png" alt="">
            <img class="absolute bottom-0 left-0 lg:w-[18%] w-[25%]  max-md:w-[40%] max-sm:w-[30%] "
                src="../assets/img/confy-negro.png" alt="">

            <div class="
        flex flex-col justify-between items-center
        p-6 rounded-2xl w-full h-auto
        md:w-[90%] md:h-[95%]
      max-md:px-0
        max-md:h-[95%]
        border border-[#7FD344] text-[#232B3A] shadow-md
      ">

                <h1 class="text-2xl md:text-3xl font-bold text-black">Registro</h1>

                <form class="flex flex-wrap flex-direction-column justify-center items-center gap-x-10 w-[85%] mt-4 md:mt-0 md:h-[90%]
                    
                    
                     
                    lg:gap-x-10 lg:w-[100%] lg:mt-4 lg:h-[90%]
                    md:gap-x-10 md:w-[100%] md:mt-4 md:h-[90%]
                    max-md:overflow-y-scroll
                    max-md:gap-y-4 max-md:flex-row max-md:gap-x-10 max-md:w-[100%] max-md:mt-0 max-md:h-[90%]
                    max-sm:gap-x-10 max-sm:w-[100%] max-sm:mt-4 max-sm:h-[90%]
                    
                    ">

                    <div class="w-[45%] max-md:w-[85%] flex flex-col items-start">
                        <label class="self-start font-bold text-sm md:text-base" for="document">
                            Documento
                        </label>
                        <input
                            class="w-full border-2 border-[#299261] bg-[#ebebeb] rounded-lg md:rounded-[0.8vw] p-2 outline-none"
                            type="text" name="document" id="document" />
                    </div>

                    <div class="w-[45%] max-md:w-[85%]  flex flex-col items-start">
                        <label class="self-start font-bold text-sm md:text-base" for="name">
                            Nombre
                        </label>
                        <input
                            class="w-full border-2 border-[#299261] bg-[#ebebeb] rounded-lg md:rounded-[0.8vw] p-2 outline-none"
                            type="text" name="name" id="name" />
                    </div>

                    <div class="w-[45%] max-md:w-[85%] flex flex-col items-start">

                        <label class="self-start font-bold text-sm md:text-base" for="name2">
                            Apellido
                        </label>
                        <input
                            class="w-full border-2 border-[#299261] bg-[#ebebeb] rounded-lg md:rounded-[0.8vw] p-2 outline-none"
                            type="text" name="name2" id="name2" />
                    </div>

                    <div class="w-[45%] max-md:w-[85%] flex flex-col items-start">

                        <label class="self-start font-bold text-sm md:text-base" for="number">
                            Teléfono
                        </label>
                        <input
                            class="w-full border-2 border-[#299261] bg-[#ebebeb] rounded-lg md:rounded-[0.8vw] p-2 outline-none"
                            type="number" name="number" id="number" />
                    </div>


                    <div class="w-[45%] max-md:w-[85%] flex flex-col items-start">
                        <label class="self-start font-bold text-sm md:text-base" for="email">
                            Correo electronico
                        </label>
                        <input
                            class="w-full border-2 border-[#299261] bg-[#ebebeb] rounded-lg md:rounded-[0.8vw] p-2 outline-none"
                            type="email" name="email" id="email" />
                    </div>


                    <div class="w-[45%] max-md:w-[85%] flex flex-col items-start">

                        <label class="self-start font-bold text-sm md:text-base" for="placa">
                            Placa
                        </label>
                        <input
                            class="w-full border-2 border-[#299261] bg-[#ebebeb] rounded-lg md:rounded-[0.8vw] p-2 outline-none"
                            type="text" name="placa" id="nplaca2" />
                    </div>




                    <p class="text-sm max-md:w-[85%] " href="">
                        ¿Ya tienes una cuenta? <a href="" class="text-[#299261] hover:underline">Inicia Sesión</a>
                    </p>

                    <button class="mt-4 bg-[#232B3A] text-white rounded-full py-2 px-6 w-[80%] md:w-[60%] hover:bg-[#299261] transition-colors
                        max-md:mt-0
                        " type="submit">
                        Siguiente
                    </button>

                </form>
            </div>


        </div>
    </div>
</template>
