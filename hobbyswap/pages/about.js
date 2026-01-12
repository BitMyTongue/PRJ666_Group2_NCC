import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image } from "react-bootstrap";
import {
  faUserCheck,
  faBox,
  faCheckCircle,
  faDollar,
} from "@fortawesome/free-solid-svg-icons";

export default function About() {
  return (
    <>
      {/* LogoSection */}
      <div className="align-items-center text-center mb-4 bg-light">
        <Image src="/images/logo-blue.png" alt="HobbySwap Logo Blue" fluid />
      </div>
      {/* About Section */}
      <div className="container">
        <div className="row">
          <div className="col-md-5 mx-auto my-md-5">
            <h2 className="text-uppercase text-primary fw-bold mb-4">
              About us
            </h2>
            <p className="text-primary lh-lg">
              Lorem ipsum dolor sit amet consectetur. A commodo arcu dictum
              volutpat donec magna magna lacus eu. Ornare aliquam tristique
              feugiat amet lobortis. Erat dolor gravida augue tristique dolor.
              Metus donec viverra pulvinar enim est sagittis. Eu mauris lectus
              enim fringilla faucibus blandit. Sed odio viverra ut enim
              suspendisse. Sapien pharetra quis elit interdum. Sit ultrices nisi
              lectus orci volutpat ullamcorper vitae Lorem ipsum dolor sit amet
              consectetur. A commodo arcu dictum volutpat donec magna magna
              lacus eu. Ornare aliquam tristique feugiat amet lobortis. Erat
              dolor gravida augue tristique dolor. Metus donec viverra pulvinar
              enim est sagittis. Eu mauris lectus enim fringilla faucibus
              blandit. Sed odio viverra ut enim suspendisse. Sapien pharetra
              quis elit interdum. Sit ultrices nisi lectus orci volutpat
              ullamcorper vitae{" "}
            </p>
          </div>
          <div className="col-md-7 mx-auto position-relative d-none d-md-block">
            <Image
              src="/images/gundam.png"
              alt="Gundam"
              fluid
              className="position-absolute translate-middle-x gundam-model-position"
            />
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-light py-1">
        <div className="container my-5">
          <div className="row">
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
              <FontAwesomeIcon
                icon={faBox}
                size="3x"
                className="text-primary mb-3"
              />
              <p className="text-primary fw-semibold">Fast Shipping</p>
            </div>
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
              <FontAwesomeIcon
                icon={faUserCheck}
                size="3x"
                className="text-primary mb-3"
              />
              <p className="text-primary fw-semibold">Safe Community</p>
            </div>
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
              <FontAwesomeIcon
                icon={faDollar}
                size="3x"
                className="text-primary mb-3"
              />
              <p className="text-primary fw-semibold">Secure Payment</p>
            </div>
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="3x"
                className="text-primary mb-3"
              />
              <p className="text-primary fw-semibold">100% Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
      {/* More Info */}
      <div className="container-fluid p-0">
        <div className="row">
          <Image
            src="/images/pokemon-cards-about.png"
            alt="Pokemon Cards"
            fluid
            className="col-md-6"
          />
          <p className="col-md-6 p-5 text-primary ">
            Lorem ipsum dolor sit amet consectetur. A commodo arcu dictum
            volutpat donec magna magna lacus eu. Ornare aliquam tristique
            feugiat amet lobortis. Erat dolor gravida augue tristique dolor.
            Metus donec viverra pulvinar enim est sagittis. Eu mauris lectus
            enim fringilla faucibus blandit. Sed odio viverra ut enim
            suspendisse. Sapien pharetra quis elit interdum. Sit ultrices nisi
            lectus orci volutpat ullamcorper vitae Lorem ipsum dolor sit amet
            consectetur. A commodo arcu dictum volutpat donec magna magna lacus
            eu. Ornare aliquam tristique feugiat amet lobortis. Erat dolor
            gravida augue tristique dolor. Metus donec viverra pulvinar enim est
            sagittis. Eu mauris lectus enim fringilla faucibus blandit. Lorem
            ipsum dolor sit amet consectetur. A commodo arcu dictum volutpat
            donec magna magna lacus eu. Ornare aliquam tristique feugiat amet
            lobortis. Erat dolor gravida augue tristique dolor. Metus donec
            viverra pulvinar enim est sagittis. Eu mauris lectus enim fringilla
            faucibus blandit. Sed odio viverra ut enim suspendisse. Sapien
            pharetra quis elit interdum. Sit ultrices nisi lectus orci volutpat
            ullamcorper vitae Lorem ipsum dolor sit amet consectetur. A commodo
            arcu dictum volutpat donec magna magna lacus eu. Ornare aliquam
            tristique feugiat amet lobortis. Erat dolor gravida augue tristique
            dolor. Metus donec viverra pulvinar enim est sagittis. Eu mauris
            lectus enim fringilla faucibus blandit.{" "}
          </p>
        </div>
      </div>
    </>
  );
}
