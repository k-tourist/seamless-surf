
import { StylePrompt } from "@/types";
import { UseMutateAsyncFunction } from "@tanstack/react-query";

export interface StylePromptFormData {
  name: string;
  prompt: string;
  is_global?: boolean;
}

export interface StylePromptHookReturn {
  stylePrompts: StylePrompt[] | undefined;
  isLoading: boolean;
  isAdmin: boolean;
  addStylePrompt: UseMutateAsyncFunction<any, Error, any>;
  updateStylePrompt: UseMutateAsyncFunction<any, Error, any>;
  deleteStylePrompt: UseMutateAsyncFunction<any, Error, any>;
}
