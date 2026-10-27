"use client";

import * as z from "zod"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Modal } from "@/app/(admin)/admin/components/ui/modal";
import { Input } from "@/app/(admin)/admin/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/app/(admin)/admin/components/ui/form";
import { Button } from "@/app/(admin)/admin/components/ui/button";
import { useBrandModal } from "@/app/(admin)/admin/hooks/use-brand-modal";

const formSchema = z.object({
  name: z.string().min(1),
});

export const BrandModal = () => {
  const brandModal = useBrandModal();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/brands`, values);
      window.location.assign(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${response.data.id}`);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create brand"
      description="Add a new brand to manage products and categories."
      isOpen={brandModal.isOpen} 
      onClose={brandModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Your Brand" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                  <Button disabled={loading} variant="outline" onClick={brandModal.onClose}>
                    Cancel
                  </Button>
                  <Button disabled={loading} type="submit">Continue</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
