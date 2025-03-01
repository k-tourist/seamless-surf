
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import HelpContent from './HelpContent';

const HelpDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-white/60 hover:text-white/80 hover:bg-white/10">
          Help
          <HelpCircle className="h-4 w-4 ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Features & Functionality Guide</DialogTitle>
        </DialogHeader>
        <HelpContent />
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
