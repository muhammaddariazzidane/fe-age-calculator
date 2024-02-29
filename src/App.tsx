/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Controller, useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MONTH } from '@/constant/month';
import { DATE } from '@/constant/date';

export default function App() {
  const currentYear = new Date()?.getFullYear();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      year: 1,
      month: '',
      date: '',
    },
    resolver: yupResolver(
      yup
        .object({
          year: yup
            .number()
            .positive('Tahun lahir Tidak boleh kurang dari 0')
            .max(
              currentYear,
              `Tahun lahir tidak boleh lebih dari ${currentYear}`
            )
            .required('Tahun lahir harus diisi'),
          month: yup.string().required('Bulan lahir harus diisi'),
          date: yup.string().required('Tanggal lahir harus diisi'),
        })
        .required()
    ),
  });

  const [age, setAge] = useState<number | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [dayOfBirth, setDayOfBirth] = useState<string>('');
  const handleCheckAge = async (data: object) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/calculate-age`,
        data
      );
      if (!response.data.error) {
        setAge(response.data.age);
        setDateOfBirth(response.data.date_of_birth);
        setDayOfBirth(response.data.day_of_birth);
      }
    } catch (error: any) {
      setAge(null);
      setDateOfBirth('');
      setDayOfBirth('');
      toast({
        variant: 'destructive',
        title: error?.response.data.message
          ? error?.response.data.message
          : error.message,
      });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-3xl font-semibold my-8">Cek usia kamu</h1>
      <div
        className={`max-w-2xl  shadow-xl rounded-2xl p-4 mx-auto grid grid-cols-1 sm:grid-cols-3
  bg-white text-black    gap-4 place-items-center`}
      >
        <form
          onSubmit={handleSubmit(handleCheckAge)}
          className=" w-full flex flex-col gap-4"
        >
          <div>
            <Label>Tanggal Lahir</Label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Pilih Tanggal Lahir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {DATE?.map((item) => (
                        <SelectItem value={item.day} key={item.day}>
                          {item.day}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-sm text-red-600">{errors.date?.message}</p>
          </div>
          <div>
            <Label>Bulan Lahir</Label>
            <Controller
              control={control}
              name="month"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Pilih Bulan Kelahiran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {MONTH?.map((item) => (
                        <SelectItem value={item.month} key={item.label}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-sm text-red-600">{errors.month?.message}</p>
          </div>

          <div>
            <Label htmlFor="year">Tahun Lahir</Label>
            <Input
              id="year"
              type="number"
              placeholder="2002"
              min={0}
              maxLength={4}
              className="rounded-xl"
              {...register('year')}
            />
            <p className="text-sm text-red-600">{errors.year?.message}</p>
          </div>
          <Button type="submit" className="rounded-xl" disabled={isSubmitting}>
            {isSubmitting ? 'Prosess...' : 'Cek sekarang'}
          </Button>
        </form>
        <div className="sm:col-span-2">
          {isSubmitting ? (
            <>
              <Skeleton className="h-5 w-64 sm:w-72" />
              <Skeleton className="h-5 w-64 sm:w-96 mt-4" />
            </>
          ) : (
            <div className={`flex flex-col gap-2 sm:p-4 ${!age && 'hidden'}`}>
              <h1 className="sm:text-lg md:text-xl text-base font-normal ">
                Usia kamu sekarang adalah{' '}
                <span className="font-bold underline">{age}</span>
                {''} tahun 🎉
              </h1>
              <h1 className="sm:text-lg md:text-xl text-base font-normal">
                Tanggal lahir kamu adalah {''}
                <span className="font-bold underline mr-1">
                  {dayOfBirth}, {dateOfBirth}
                </span>
                {''}🎂
              </h1>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
