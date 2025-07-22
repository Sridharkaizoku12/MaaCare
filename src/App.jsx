import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import MaaCare from "./Components/MaaCare"
import { TooltipProvider } from "./Components/ui/tooltip"
import { Toaster } from "sonner"
import { BrowserRouter, Route, Routes } from "react-router"
import NotFound from "./Components/NotFound"


function App() {

const queryClient = new QueryClient();
  return (
    <>
       <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MaaCare />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
    </>
  )
}

export default App
