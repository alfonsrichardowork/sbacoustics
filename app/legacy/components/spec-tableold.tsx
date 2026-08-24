import { SpecificationProp } from '@/app/(frontend)/types';
import { CSSProperties } from 'react';

interface Props {
  spec: SpecificationProp[];
  styling: CSSProperties;
  stylingTitle: CSSProperties;
}

export default function SpecificationTableOld({ spec, styling, stylingTitle }: Props) {
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
    <div style={{
      paddingTop: '32px'
    }}>
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
          <div key={parentName} style={{
            marginBottom: '32px'
          }}>
            <table style={{
              paddingBlock: '16px',
              width: '100%',
              captionSide: 'bottom',
              fontSize: '14px',
              lineHeight: '1.43'
            }}>
              <tbody>
                <tr style={{
                  borderBottomWidth: '1px',
                }}>
                  <td style={{
                    paddingBottom: '8px',
                    paddingInline: '0px',
                    paddingTop: '0px',
                    textAlign: 'start',
                    ...stylingTitle
                  }}>{parentName}</td>
                  {subParentNames.map((subName, idx) => (
                    <td key={idx} style={{
                    padding: '16px',
                    verticalAlign: 'middle',
                    fontWeight: 600,
                    fontSize: '12px',
                    textAlign: 'end',
                    ...styling
                  }}>
                      {subName}
                    </td>
                  ))}
                </tr>

                {allChildren.map((childName, rowIdx) => (
                  <tr style={{
                    borderBottomWidth: '1px',
                    borderWidth: '1px'
                  }}>
                    <td style={{
                      padding: '16px',
                      verticalAlign: 'middle',
                      paddingLeft: '8px',
                      ...styling
                    }}>
                      {childName}
                      {allNotes[rowIdx] && allNotes[rowIdx] !== '' && (
                        <sup style={{
                          fontSize: '12px',
                          marginLeft: '4px'
                        }}>
                          ({counter++})
                        </sup>
                      )}
                    </td>
                    {subGroups.map((sub, subIdx) => {
                      const foundChild = sub.child.find((c) => c.childname === childName);
                      const value =
                        foundChild && foundChild.value && foundChild.value.trim() !== ''
                          ? `${foundChild.value} ${foundChild.unit || ''}`
                          : '-';
                      return (
                        <td
                          key={subIdx}
                          style={{
                            padding: '16px',
                            verticalAlign: 'middle',
                            textAlign: 'right',
                            paddingRight: '8px',
                            ...styling
                          }}
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
      <div>
        {allNotesNonNull.map((val, idx) => 
          <div key={idx} style={{
            fontSize: '12px',
            lineHeight: "1.33"
          }}>
            ({idx + 1}) {val}
          </div>
        )}
        {allAdditionalNotes.map((val, idx) => 
          <div key={idx} style={{
            fontSize: '12px',
            lineHeight: "1.33"
          }}>
            - {val}
          </div>
        )}
      </div>
    </div>
  );
}