import { Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Stack } from "@chakra-ui/react";
import NavLink from "./NavLink";

const MobileDrawer = ({ isOpen, onClose, navItems }) => (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
                <Stack as="nav" spacing={4}>
                    {navItems.map((item) => (
                        <NavLink key={item.href} href={item.href} icon={item.icon}>
                            {item.label}
                        </NavLink>
                    ))}
                </Stack>
            </DrawerBody>
        </DrawerContent>
    </Drawer>
);

export default MobileDrawer;