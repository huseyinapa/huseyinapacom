// import React from "react";

// function clsx(...args: any) {
//   return args.filter(Boolean).join(" ");
// }

// const components: any = {
//   h1: ({ className, ...props }: any) => (
//     <h1
//       className={clsx(
//         "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
//         className
//       )}
//       {...props}
//     />
//   ),
//   h2: ({ className, ...props }: any) => (
//     <h2
//       className={clsx(
//         "mt-10 scroll-m-20 border-b border-b-zinc-800 pb-1 text-3xl font-semibold tracking-tight first:mt-0",
//         className
//       )}
//       {...props}
//     />
//   ),
//   h3: ({ className, ...props }: any) => (
//     <h3
//       className={clsx(
//         "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
//         className
//       )}
//       {...props}
//     />
//   ),
//   h4: ({ className, ...props }: any) => (
//     <h4
//       className={clsx(
//         "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
//         className
//       )}
//       {...props}
//     />
//   ),
//   h5: ({ className, ...props }: any) => (
//     <h5
//       className={clsx(
//         "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
//         className
//       )}
//       {...props}
//     />
//   ),
//   h6: ({ className, ...props }: any) => (
//     <h6
//       className={clsx(
//         "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
//         className
//       )}
//       {...props}
//     />
//   ),
//   a: ({ className, ...props }: any) => (
//     <a
//       className={clsx(
//         "font-medium text-zinc-900 underline underline-offset-4",
//         className
//       )}
//       {...props}
//     />
//   ),
//   p: ({ className, ...props }: any) => (
//     <p
//       className={clsx("leading-7 [&:not(:first-child)]:mt-6", className)}
//       {...props}
//     />
//   ),
//   ul: ({ className, ...props }: any) => (
//     <ul className={clsx("my-6 ml-6 list-disc", className)} {...props} />
//   ),
//   ol: ({ className, ...props }: any) => (
//     <ol className={clsx("my-6 ml-6 list-decimal", className)} {...props} />
//   ),
//   li: ({ className, ...props }: any) => (
//     <li className={clsx("mt-2", className)} {...props} />
//   ),
//   blockquote: ({ className, ...props }: any) => (
//     <blockquote
//       className={clsx(
//         "mt-6 border-l-2 border-zinc-300 pl-6 italic text-zinc-800 [&>*]:text-zinc-600",
//         className
//       )}
//       {...props}
//     />
//   ),
//   img: ({
//     className,
//     alt,
//     ...props
//   }: React.ImgHTMLAttributes<HTMLImageElement>) => (
//     // eslint-disable-next-line @next/next/no-img-element
//     <img
//       className={clsx("rounded-md border border-zinc-200", className)}
//       alt={alt}
//       {...props}
//     />
//   ),
//   hr: ({ ...props }: any) => (
//     <hr className="my-4 border-zinc-200 md:my-8" {...props} />
//   ),
//   table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
//     <div className="w-full my-6 overflow-y-auto">
//       <table className={clsx("w-full", className)} {...props} />
//     </div>
//   ),
//   tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
//     <tr
//       className={clsx(
//         "m-0 border-t border-zinc-300 p-0 even:bg-zinc-100",
//         className
//       )}
//       {...props}
//     />
//   ),
//   th: ({ className, ...props }: any) => (
//     <th
//       className={clsx(
//         "border border-zinc-200 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
//         className
//       )}
//       {...props}
//     />
//   ),
//   td: ({ className, ...props }: any) => (
//     <td
//       className={clsx(
//         "border border-zinc-200 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
//         className
//       )}
//       {...props}
//     />
//   ),
//   pre: ({ className, ...props }: any) => (
//     <pre
//       className={clsx(
//         "mt-6 mb-4 overflow-x-auto rounded-lg bg-zinc-900 py-4",
//         className
//       )}
//       {...props}
//     />
//   ),
//   code: ({ className, ...props }: any) => (
//     <code
//       className={clsx(
//         "relative rounded border bg-zinc-300 bg-opacity-25 py-[0.2rem] px-[0.3rem] font-mono text-sm text-zinc-600",
//         className
//       )}
//       {...props}
//     />
//   ),
//   // Diğer HTML elementleri ve bileşenleri tanımlayın
// };

// interface JsonComponentProps {
//   data: any;
// }

// export function JsonComponent({ data }: JsonComponentProps) {
//   const renderContent = (item: any) => {
//     switch (item.type) {
//       case "h1":
//         return (
//           <components.h1 key={item.key} className={item.className}>
//             {item.content}
//           </components.h1>
//         );
//       case "h2":
//         return (
//           <components.h2 key={item.key} className={item.className}>
//             {item.content}
//           </components.h2>
//         );
//       case "h3":
//         return (
//           <components.h3 key={item.key} className={item.className}>
//             {item.content}
//           </components.h3>
//         );
//       case "h4":
//         return (
//           <components.h4 key={item.key} className={item.className}>
//             {item.content}
//           </components.h4>
//         );
//       case "h5":
//         return (
//           <components.h5 key={item.key} className={item.className}>
//             {item.content}
//           </components.h5>
//         );
//       case "h6":
//         return (
//           <components.h6 key={item.key} className={item.className}>
//             {item.content}
//           </components.h6>
//         );
//       case "a":
//         return (
//           <components.a
//             key={item.key}
//             className={item.className}
//             href={item.href}
//           >
//             {item.content}
//           </components.a>
//         );
//       case "p":
//         return (
//           <components.p key={item.key} className={item.className}>
//             {item.content}
//           </components.p>
//         );
//       case "ul":
//         return (
//           <components.ul key={item.key} className={item.className}>
//             {item.items.map((subItem: any) => renderContent(subItem))}
//           </components.ul>
//         );
//       case "ol":
//         return (
//           <components.ol key={item.key} className={item.className}>
//             {item.items.map((subItem: any) => renderContent(subItem))}
//           </components.ol>
//         );
//       case "li":
//         return (
//           <components.li key={item.key} className={item.className}>
//             {item.content}
//           </components.li>
//         );
//       case "blockquote":
//         return (
//           <components.blockquote key={item.key} className={item.className}>
//             {item.content}
//           </components.blockquote>
//         );
//       case "img":
//         return (
//           <components.img
//             key={item.key}
//             className={item.className}
//             src={item.src}
//             alt={item.alt}
//           />
//         );
//       case "hr":
//         return <components.hr key={item.key} className={item.className} />;
//       case "table":
//         return (
//           <components.table key={item.key} className={item.className}>
//             {item.children.map((row: any, index: number) =>
//               row.type === "tr" ? (
//                 <components.tr key={index} className={row.className}>
//                   {row.children.map((cell: any, i: number) =>
//                     cell.type === "th" ? (
//                       <components.th
//                         key={i}
//                         className={cell.className}
//                         align={cell.align}
//                       >
//                         {cell.content}
//                       </components.th>
//                     ) : (
//                       <components.td
//                         key={i}
//                         className={cell.className}
//                         align={cell.align}
//                       >
//                         {cell.content}
//                       </components.td>
//                     )
//                   )}
//                 </components.tr>
//               ) : null
//             )}
//           </components.table>
//         );
//       case "pre":
//         return (
//           <components.pre key={item.key} className={item.className}>
//             {item.content}
//           </components.pre>
//         );
//       case "code":
//         return (
//           <components.code key={item.key} className={item.className}>
//             {item.content}
//           </components.code>
//         );
//       default:
//         return null;
//     }
//   };

//   return <div>{data.map((item: any) => renderContent(item))}</div>;
// }
