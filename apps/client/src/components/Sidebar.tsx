import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export interface Workflow {
  _id: string;
  name: string;
  updatedAt?: string;
  isActive: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  workflows: Workflow[];
  onSelectWorkflow: (id: string) => void;
  isLoading?: boolean;
}

export function Sidebar({
  isOpen,
  setIsOpen,
  workflows,
  onSelectWorkflow,
  isLoading,
}: SidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] border-r border-border/50 backdrop-blur-xl bg-background/80"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">
            My Workflows
          </SheetTitle>
          <SheetDescription>
            Select a workflow to open in the canvas.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p>Loading workflows...</p>
            </div>
          ) : workflows?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2 border border-dashed border-border rounded-lg m-1">
              <p>No workflows found</p>
              <Button variant="link" onClick={() => setIsOpen(false)}>
                Create your first one
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pb-6">
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2 border border-dashed border-border rounded-lg m-1">
                <Button
                  variant="link"
                  onClick={() => {
                    onSelectWorkflow("-1");
                    setIsOpen(false);
                  }}
                >
                  Create new
                </Button>
              </div>

              {workflows?.map((workflow) => (
                <Button
                  key={workflow._id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4 border-l-4 border-l-transparent hover:border-l-primary hover:bg-accent transition-all duration-200 group"
                  onClick={() => {
                    onSelectWorkflow(workflow._id);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex flex-col items-start gap-1 w-full overflow-hidden">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold truncate group-hover:text-primary transition-colors">
                        {workflow.name || "Untitled Workflow"}
                      </span>
                      {workflow.isActive && (
                        <span
                          className="h-2 w-2 rounded-full bg-green-500 shrink-0"
                          title="Active"
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                      <span className="font-mono opacity-70">
                        ID: {workflow._id.slice(-6)}
                      </span>
                    </div>
                    <span className="font-mono opacity-70">
                      Updated at: {workflow.updatedAt?.slice(0, 10)}{" "}
                      {workflow.updatedAt?.slice(11, 16)}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background/95 backdrop-blur-sm">
          <p className="text-xs text-center text-muted-foreground">
            Decentralised Automation
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
