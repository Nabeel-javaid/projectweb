import React, { useEffect } from 'react';
import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  Button,
  SimpleGrid,
  useBreakpointValue,
  Icon,
} from '@chakra-ui/react';
import Lottie from 'react-lottie';
import animationData from '../../components/lottie/map.json';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { supabase } from 'utils/supabase';
import { FcGoogle } from 'react-icons/fc'; // Google icon
import { FaGithub } from 'react-icons/fa'; // GitHub icon

export default function JoinOurTeam() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchAdminEmail = async () => {
      try {
        const { data, error } = await supabase.from('admin').select('email');
        if (error) throw new Error(error.message);

        const adminEmails = data.map((admin) => admin.email);

        if (adminEmails.includes(session?.user?.email)) {
          router.push('/adminProfile');
        } else {
          router.push('/app');
        }

      } catch (error) {
        console.error('Error fetching admin email:', error.message);
      }
    };

    if (session) fetchAdminEmail();
  }, [status, session, router]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

    
    return (
      <Box position={"relative"}>
        <Container
          as={SimpleGrid}
          maxW={"7xl"}
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 10, lg: 32 }}
          py={{ base: 10, sm: 20, lg: 32 }}
        >
          <Stack spacing={{ base: 10, md: 20 }}>
            <Lottie
              options={defaultOptions}
              height={700}
              width={620}
            />
          </Stack>
          <Stack
            bg={"gray.50"}
            rounded={"xl"}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: "lg" }}
          >
            <Stack spacing={5}>
              <Heading
                color={"gray.800"}
                lineHeight={1.1}
                fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              >
                Lets Dive In
                <Text
                  as={"span"}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  bgClip="text"
                >
                  !
                </Text>
              </Heading>
              {/* <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
              One place platform for researchers, students and organisation to
              callaborate and find exciting opportunities.
            </Text> */}


              <div className="mt-8">
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-md">
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                          Username
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
                      </div>
                      <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                          Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                      </div>
                      <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                          Sign In
                        </button>
                        <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                          Forgot Password?
                        </a>
                      </div>
                    </form>
                    <p className="text-center text-gray-500 text-xs">
                      &copy;2024 Acme Corp. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </Stack>

            <Box as={"form"} mt={10}>
              <Stack spacing={4} align="center">
                {/* Google Sign In */}
                <Button
                  leftIcon={<FcGoogle />}
                  onClick={() => signIn('google')}
                  bg="white"
                  color="gray.900"
                  variant="outline"
                  _hover={{ bg: "gray.100" }}
                  w="full"
                >
                  Sign in with Google
                </Button>

                {/* GitHub Sign In */}
                <Button
                  leftIcon={<FaGithub />}
                  onClick={() => signIn('github')}
                  bg="gray.900"
                  color="white"
                  _hover={{ bg: "gray.800" }}
                  w="full"
                >
                  Sign in with GitHub
                </Button>


              </Stack>
            </Box>
          </Stack>
        </Container>
        <Blur
          position={"absolute"}
          top={-10}
          left={-10}
          style={{ filter: "blur(70px)" }}
        />
      </Box>
    );
  }

  export const Blur = (props) => {
    return (
      <Icon
        width={useBreakpointValue({ base: "100%", md: "40vw", lg: "30vw" })}
        zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
        height="560px"
        viewBox="0 0 528 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <circle cx="71" cy="61" r="111" fill="#F56565" />
        <circle cx="244" cy="106" r="139" fill="#ED64A6" />
        <circle cy="291" r="139" fill="#ED64A6" />
        <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
        <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
        <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
        <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
      </Icon>
    );
  };