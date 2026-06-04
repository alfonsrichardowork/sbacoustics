// import { SpecificationProp } from '@/app/(frontend)/types';
// import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

// export default function SpecificationTable(spec: SpecificationProp[], styling: string, stylingTitle: string) {
//   let oldParent = ''
//   let oldSubParent = ''
//   let found : string | undefined = undefined
//   spec.map((val) => {
//     oldParent = val.parentname
//     oldSubParent = val.subparentname
//     found = spec.find((val2) => val != val2 && val2.parentname === oldParent && oldSubParent != '' && val2.subparentname != '')?.parentname
//   })
//   return (
//     <>
//       {spec.map((val, indexTable) => (
//         <Table key={indexTable} className='py-4'>
//           <div className={stylingTitle}>{val.parentname}</div>
//           <div className={`${styling}`}>{val.subparentname}</div>
//           <TableBody>
//             {val.child.map((row, index) => (
//               <TableRow key={index}>
//                 <TableCell className={styling}>
//                   <h3>{row.childname}</h3>
//                 </TableCell>
//                 <TableCell className={`${styling} text-right`}>
//                   <h4>{row.value && row.value !== '' ? `${row.value} ${row.unit}` : '-'}</h4>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       ))}
//     </>
//   );
// }




import { SpecificationProp } from '@/app/(frontend)/types';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

interface Props {
  spec: SpecificationProp[];
  styling: string;
  stylingTitle: string;
}

export default function SpecificationTable({ spec, styling, stylingTitle }: Props) {
  let counter = 1
  let allNotesNonNull: string[] = []
  let allAdditionalNotes: string[] = []
  // Step 1: Group data by parent
  const groupedByParent = spec.reduce((acc, curr) => {
    if (!acc[curr.parentname]) acc[curr.parentname] = [];
    acc[curr.parentname]?.push(curr);
    return acc;
  }, {} as Record<string, SpecificationProp[]>);


  return (
    <div className='pt-8'>
      {Object.entries(groupedByParent).map(([parentName, subGroups]) => {
        // Step 2: Collect all unique childnames
        const allChildren = Array.from(
          new Set(subGroups.flatMap((sub) => sub.child.map((c) => c.childname)))
        );

        //For all notes
        const allNotes = Array.from(
          (subGroups[0]?.child?.map((c) => c.notes) ?? [])
        );

        allNotesNonNull = [...allNotesNonNull, ...allNotes.filter((val) => val.trim() !== '')];

        // Step 3: Collect all subparent names (for column headers)
        const subParentNames = subGroups.map((s) =>
          s.subparentname && s.subparentname.trim() !== '' ? s.subparentname : ''
        );
        parentName === "Additional Notes" &&
          subGroups.map((sub) => 
            sub.child.map((subsub) => 
              allAdditionalNotes.push(subsub.value)
          ))
          
        return (
          parentName !== "Additional Notes" &&
          <div key={parentName} className="mb-8">
            {/* <div className={`${stylingTitle}`}></div> */}
            <Table className='py-4'>
              <TableBody>
                {/* Header Row */}
                <TableRow>
                  <TableCell className={`${stylingTitle} pb-2 px-0 pt-0 text-start`}>{parentName}</TableCell>
                  {subParentNames.map((subName, idx) => (
                    <TableCell key={idx} className={`${styling} font-semibold text-xs text-end`}>
                      {subName}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Data Rows */}
                {allChildren.map((childName, rowIdx) => (
                  <TableRow key={rowIdx}>
                    <TableCell className={`${styling}`}>
                      {childName}
                      {allNotes[rowIdx] && allNotes[rowIdx] !== '' && (
                        <sup className="text-xs ml-1">({counter++})</sup>
                      )}
                    </TableCell>
                    {subGroups.map((sub, subIdx) => {
                      const foundChild = sub.child.find((c) => c.childname === childName);
                      const value =
                        foundChild && foundChild.value && foundChild.value.trim() !== ''
                          ? `${foundChild.value} ${foundChild.unit || ''}`
                          : '-';
                      return (
                        <TableCell
                          key={subIdx}
                          className={`${styling} text-right`}
                        >
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      })}
      <div className=''>
        {allNotesNonNull.map((val, idx) => 
          <div key={idx} className='text-xs'>
            ({idx + 1}) {val}
          </div>
        )}
        {allAdditionalNotes.map((val, idx) => 
          <div key={idx} className='text-xs'>
            - {val}
          </div>
        )}
      </div>
    </div>
  );
}