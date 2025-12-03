import {
  AppShell,
  Burger,
  createTheme,
  MantineProvider,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CodeView } from "../code/Code";
import { useCodeStore } from "../../stores/code.store.mts";

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  const [opened, { toggle }] = useDisclosure();
  // const parsed = useCodeStore((s) => s.parsed);
  // const setRaw = useCodeStore((s) => s.setRaw);
  const code = useCodeStore();

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppShell
        padding="md"
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

          <div>Logo</div>
        </AppShell.Header>

        <AppShell.Navbar>
          Navbar
          <Textarea onChange={(e) => code.setRaw(e.target.value)} />
        </AppShell.Navbar>

        <AppShell.Main>
          <CodeView code={code.parsed} />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
